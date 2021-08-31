package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeluRouteNotFoundException extends Exception {

    public LeluRouteNotFoundException(String message) {
        super(message);
    }

}
