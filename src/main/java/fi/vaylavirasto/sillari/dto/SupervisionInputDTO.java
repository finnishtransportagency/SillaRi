package fi.vaylavirasto.sillari.dto;

import lombok.Data;

@Data
public class SupervisionInputDTO {
    private Integer supervisionId;
    private Integer routeTransportId;
    private String transportCode;
}
