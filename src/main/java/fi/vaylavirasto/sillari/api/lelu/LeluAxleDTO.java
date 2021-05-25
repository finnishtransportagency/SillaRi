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

    @NotNull
    @Schema(description = "Order number of the axle", required = true)
    private Integer axleNumber;

    @NotNull
    @Schema(description = "Axle weight (t)", required = true)
    private Double weight;

    @NotNull
    @Schema(description = "Distance to the next axle (m). 0 if axle is the last one in the chart.", required = true)
    private Double distance;

    @Schema(description = "Varying axle length. Max distance to the next axle (m).")
    private Double maxDistanceToNext;

}
