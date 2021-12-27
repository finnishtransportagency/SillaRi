package fi.vaylavirasto.sillari.api.lelu.permit;

import fi.vaylavirasto.sillari.model.VehicleRole;
import fi.vaylavirasto.sillari.util.StringValueOfEnum;
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

    @StringValueOfEnum(enumClass = VehicleRole.class, message = "{vehicle.role.valid.options}")
    @Schema(description = "Vehicle role", allowableValues = {"TRUCK, TRAILER, PUSHING_VEHICLE"}, example = "TRUCK")
    private String role;

    @NotBlank(message = "{vehicle.identifier.not.blank}")
    @Schema(description = "Registration number", required = true, example = "ABC-123")
    private String identifier;

    public LeluVehicleDTO() {
    }

    public LeluVehicleDTO(String type, String identifier) {
        this.type = type;
        this.identifier = identifier;
    }

}
