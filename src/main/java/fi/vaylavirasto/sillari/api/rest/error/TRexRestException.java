package fi.vaylavirasto.sillari.api.rest.error;


import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
public class TRexRestException extends Exception {
    private HttpStatus statusCode;

    public TRexRestException() {
    }

    public TRexRestException(String message, HttpStatus statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

}
