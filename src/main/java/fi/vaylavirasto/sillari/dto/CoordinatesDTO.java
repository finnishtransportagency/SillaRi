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
            double x = Double.parseDouble(xString);
            double y = Double.parseDouble(yString);
            this.x = x;
            this.y = y;
        } catch (NumberFormatException ignored) {
        }
    }
}
