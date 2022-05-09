package fi.vaylavirasto.sillari.dto;

import lombok.Data;

@Data
public class CoordinatesDTO {
    private Double x;
    private Double y;

    public CoordinatesDTO(Double x, Double y) {
    }

    public CoordinatesDTO() {

    }
}
