package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class LeluDeleteRouteWithSupervisionsException extends Exception {

    public LeluDeleteRouteWithSupervisionsException(String message) {
        super(message);
    }

}
