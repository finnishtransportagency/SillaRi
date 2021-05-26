package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluVehicleDTO {

    @NotBlank
    @Schema(description = "Vehicle type", required = true, example = "kuorma-auto")
    private String type;

    @NotBlank
    @Schema(description = "Registration number", required = true, example = "ABC-123")
    private String identifier;

}
