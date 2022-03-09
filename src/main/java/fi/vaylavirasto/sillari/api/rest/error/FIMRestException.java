package fi.vaylavirasto.sillari.api.rest.error;


import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class FIMRestException extends Exception {
    private HttpStatus statusCode;

    public FIMRestException() {
    }

    public FIMRestException(String message, HttpStatus statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public FIMRestException(String message) {
        super(message);
    }
}
