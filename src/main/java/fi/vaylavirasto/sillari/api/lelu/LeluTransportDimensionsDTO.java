package fi.vaylavirasto.sillari.api.lelu;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluTransportDimensionsDTO {

    @NotNull(message = "{transport.dimensions.width.not.null}")
    @Schema(description = "Transport max width (m)", required = true, example = "3.45")
    private Double width;

    @NotNull(message = "{transport.dimensions.length.not.null}")
    @Schema(description = "Transport max length (m)", required = true, example = "23.4")
    private Double length;

    @NotNull(message = "{transport.dimensions.height.not.null}")
    @Schema(description = "Transport max height from the ground (m)", required = true, example = "4.5")
    private Double height;

}
