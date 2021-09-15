package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class LeluPermitSaveException extends Exception {

    public LeluPermitSaveException(String message) {
        super(message);
    }

}
