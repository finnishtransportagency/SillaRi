package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluSupervisor {
    @Schema(description = "Supervisor first name")
    private String firstName;
    @Schema(description = "Supervisor last name")
    private String lastName;
}
