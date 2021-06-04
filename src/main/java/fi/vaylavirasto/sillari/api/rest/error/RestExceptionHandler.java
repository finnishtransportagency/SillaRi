package fi.cgi.klp.rest.error;

import fi.vaylavirasto.sillari.api.rest.error.APIVersionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
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
import java.util.*;
import java.util.stream.Collectors;

@ControllerAdvice
public class RestExceptionHandler extends ResponseEntityExceptionHandler {
    private static final Logger LOGGER = LoggerFactory.getLogger(RestExceptionHandler.class);

    @Autowired
    private MessageSource messageSource;

    @Override
    @NonNull
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  @NonNull HttpHeaders headers,
                                                                  HttpStatus status, @NonNull WebRequest request) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());

        // Get all errors
        List<String> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(DefaultMessageSourceResolvable::getDefaultMessage)
                .collect(Collectors.toList());

        body.put("errors", errors);

        LOGGER.warn("MethodArgumentNotValidException 'errors':'{}', 'headers':'{}', 'status':'{}'", errors, headers, status);
        return new ResponseEntity<>(body, headers, status);
    }

    // Let Spring handle the exception, we just override the status code
    @ExceptionHandler(Exception.class)
    public void other(Exception ex, HttpServletResponse response) throws IOException {
        LOGGER.error("General Exception: ", ex);
        response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value());
    }


    @ExceptionHandler(APIVersionException.class)
    public ResponseEntity<Object> apiValidationException(APIVersionException ex) {
        LOGGER.error("APIValidationException 'reason':'{}'", ex.getMessage());
        return handleCustomException(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    private ResponseEntity<Object> handleCustomException(String message, HttpStatus status) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", new Date());
        body.put("status", status.value());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }

}

