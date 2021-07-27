package fi.vaylavirasto.sillari.api.rest.error;

import fi.vaylavirasto.sillari.api.rest.error.APIVersionException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger logger = LogManager.getLogger();

    @Override
    @NonNull
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  @NonNull HttpHeaders headers,
                                                                  @NonNull HttpStatus status,
                                                                  @NonNull WebRequest request) {
        // Get all errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        logger.warn("MethodArgumentNotValidException 'errors':'{}', 'headers':'{}', 'status':'{}'", errors, headers, status);

        return createErrorResponse(status, null, errors);
    }

    // Let Spring handle the exception, we just override the status code
    @ExceptionHandler(Exception.class)
    public void other(Exception ex, HttpServletResponse response) throws IOException {
        logger.error("General Exception: ", ex);
        response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }

    @ExceptionHandler(LeluPermitSaveException.class)
    public ResponseEntity<Object> leluPermitSaveException(LeluPermitSaveException ex) {
        logger.error("LeluPermitSaveException 'id':'{}'", ex.getMessage());
        return handleCustomException(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(APIVersionException.class)
    public ResponseEntity<Object> apiVersionException(APIVersionException ex) {
        logger.error("apiVersionException 'reason':'{}'", ex.getMessage());
        return createErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), null);
    }

    private ResponseEntity<Object> createErrorResponse(HttpStatus status, String message, List<String> errors) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        if (message != null) {
            body.put("message", message);
        }
        if (errors != null && !errors.isEmpty()) {
            body.put("errors", errors);
        }
        return new ResponseEntity<>(body, status);
    }

    private ResponseEntity<Object> handleCustomException(String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }

}
