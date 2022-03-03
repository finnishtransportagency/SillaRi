package fi.vaylavirasto.sillari.api.lelu.permit_current;

import fi.vaylavirasto.sillari.model.VehicleRole;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluVehicleDTO {

    @NotBlank(message = "{vehicle.type.not.blank}")
    @Schema(description = "Vehicle type", required = true, example = "kuorma-auto")
    private String type;

    @Schema(description = "Vehicle role", example = "TRUCK")
    private VehicleRole role;

    @NotBlank(message = "{vehicle.identifier.not.blank}")
    @Schema(description = "Registration number", required = true, example = "ABC-123")
    private String identifier;

    public LeluVehicleDTO() {
    }

    public LeluVehicleDTO(String type, VehicleRole role, String identifier) {
        this.type = type;
        this.role = role;
        this.identifier = identifier;
    }

}
