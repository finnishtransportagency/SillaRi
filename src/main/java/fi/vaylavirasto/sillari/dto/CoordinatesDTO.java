package fi.vaylavirasto.sillari.dto;

import lombok.Data;
import lombok.ToString;

@Data
@ToString
public class CoordinatesDTO {
    private Double x;
    private Double y;

    public CoordinatesDTO() {
    }

    public CoordinatesDTO(Double x, Double y) {
        this.x = x;
        this.y = y;
    }

    public CoordinatesDTO(String xString, String yString) {
        try {
            Double x = Double.valueOf(xString);
            Double y = Double.valueOf(yString);
            this.setX(x);
            this.setY(y);
        } catch (NumberFormatException ignored) {
        }
    }
}
