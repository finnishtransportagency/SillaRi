package fi.vaylavirasto.sillari.api.lelu.permit_2_0_0;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluCoordinatesDTO {
    @NotNull(message = "{coordinates.x.not.null}")
    @Schema(description = "x", required = true, example = "60.2252994299582")
    private Double x;

    @NotNull(message = "{coordinates.y.not.null}")
    @Schema(description = "y", required = true, example = "24.72591876940719")
    private Double y;

    @NotNull(message = "{coordinates.wkid.not.null}")
    @Schema(description = "Spatial reference well known id", required = true, example = "3857")
    private Integer wkid;
}
