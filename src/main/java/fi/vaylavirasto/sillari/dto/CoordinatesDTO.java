package fi.vaylavirasto.sillari.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class CoordinatesDTO {
    private Double x;
    private Double y;

    public CoordinatesDTO(Double x, Double y) {
        this.x = x;
        this.y = y;
    }

    public CoordinatesDTO() {

    }
}
