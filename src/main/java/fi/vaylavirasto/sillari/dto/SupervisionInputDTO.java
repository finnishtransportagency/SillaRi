package fi.vaylavirasto.sillari.dto;

import fi.vaylavirasto.sillari.model.SupervisionModel;
import lombok.Data;

@Data
public class SupervisionInputDTO {
    private SupervisionModel supervision;
    private String transportCode;
}
