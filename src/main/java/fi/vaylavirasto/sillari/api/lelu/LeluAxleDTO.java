package fi.vaylavirasto.sillari.api.lelu;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluAxleDTO {

    @NotNull(message = "{axle.number.not.null}")
    @Schema(description = "Order number of the axle", required = true, example = "1")
    private Integer axleNumber;

    @NotNull(message = "{axle.weight.not.null}")
    @Schema(description = "Axle weight (t)", required = true, example = "9.1")
    private Double weight;

    @NotNull(message = "{axle.distance.not.null}")
    @Schema(description = "Distance to the next axle (m). 0 if axle is the last one in the chart.", required = true, example = "8.5")
    private Double distanceToNext;

    @Schema(description = "Varying axle length. Max distance to the next axle (m).", example = "10.5")
    private Double maxDistanceToNext;

}
