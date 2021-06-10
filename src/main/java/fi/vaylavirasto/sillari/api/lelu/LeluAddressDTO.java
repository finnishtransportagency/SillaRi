package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString


public class LeluAddressDTO {
    @NotBlank(message = "{address.address.not.blank}")
    @Schema(description = "Street address", required = true, example = "Aleksanterinkatu 17, 00100 Helsinki")
    private String address;

    @NotNull(message = "{address.coordinates.not.null}")
    @Schema(description = "Coordinates", required = true)
    private LeluCoordinatesDTO coordinates;
}

