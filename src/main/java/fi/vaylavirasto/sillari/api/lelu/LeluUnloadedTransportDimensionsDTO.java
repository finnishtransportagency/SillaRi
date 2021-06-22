package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluUnloadedTransportDimensionsDTO {


    @Schema(description = "Transport max width (m)", required = true, example = "2.45")
    private Double width;


    @Schema(description = "Transport max length (m)", required = true, example = "21.4")
    private Double length;


    @Schema(description = "Transport max height from the ground (m)", required = true, example = "5.5")
    private Double height;

    public LeluUnloadedTransportDimensionsDTO() {
    }

    public LeluUnloadedTransportDimensionsDTO(Double width, Double length, Double height) {
        this.width = width;
        this.length = length;
        this.height = height;
    }

}
