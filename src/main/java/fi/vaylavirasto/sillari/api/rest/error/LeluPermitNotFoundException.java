package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeluPermitNotFoundException extends Exception {

    public LeluPermitNotFoundException(String message) {
        super(message);
    }

}
