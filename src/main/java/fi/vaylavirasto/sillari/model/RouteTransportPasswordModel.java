package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class RouteTransportPasswordModel {
    private Integer id;
    private Integer routeTransportId;
    private String transportPassword;
    private OffsetDateTime validFrom;
    private OffsetDateTime validTo;
}
