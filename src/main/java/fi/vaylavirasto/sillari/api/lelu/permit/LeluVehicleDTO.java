package fi.vaylavirasto.sillari.api.lelu.permit;

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
    private static final String NO_VEHICLE_IDENTIFIER = "<EI TUNNISTETTA>";

    @NotBlank(message = "{vehicle.type.not.blank}")
    @Schema(description = "Vehicle type", required = true, example = "kuorma-auto")
    private String type;

    @Schema(description = "Vehicle role", example = "TRUCK")
    private VehicleRole role;

    @Schema(description = "Registration number or product number", example = "ABC-123")
    private String identifier = NO_VEHICLE_IDENTIFIER;

    public LeluVehicleDTO() {
    }

    public LeluVehicleDTO(String type, VehicleRole role, String identifier) {
        this.type = type;
        this.role = role;
        this.identifier = identifier;
    }

}
