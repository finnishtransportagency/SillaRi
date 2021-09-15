package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.http.HttpStatus;

@Getter
@Setter
@NoArgsConstructor
public class LeluRouteGeometryUploadException extends Exception {
    private HttpStatus statusCode;

    public LeluRouteGeometryUploadException(String message, HttpStatus statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
