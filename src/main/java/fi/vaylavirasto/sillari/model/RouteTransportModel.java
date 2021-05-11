package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;
import java.util.List;

@Data
public class RouteTransportModel {
    private long id;
    private long routeId;
    private OffsetDateTime departureTime;
    private OffsetDateTime arrivalTime;
    private TransportStatus status;
    private String currentLocation;
    private OffsetDateTime currentLocationUpdated;
    private List<SupervisionModel> supervisions;
}
