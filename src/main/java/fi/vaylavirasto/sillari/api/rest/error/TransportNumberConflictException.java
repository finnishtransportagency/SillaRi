package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TransportNumberConflictException extends Exception {
    public TransportNumberConflictException(String message) {
        super(message);
    }
}
