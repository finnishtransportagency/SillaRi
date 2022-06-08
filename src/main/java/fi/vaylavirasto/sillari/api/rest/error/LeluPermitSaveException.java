package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;


@Getter
@Setter
@NoArgsConstructor
public class LeluPermitSaveException extends Exception {
    private HttpStatus statusCode;

    public LeluPermitSaveException(HttpStatus statusCode, String message) {
        super(message);
        this.statusCode = statusCode;
    }

}
