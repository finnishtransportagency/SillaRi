package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class RouteTransportStatusModel {
    private Integer id;
    private Integer routeTransportId;
    private TransportStatusType status;
    private OffsetDateTime time;
}
