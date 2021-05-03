package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class TransportationModel {
    private long id;
    private long permitId;
    private long routeId;
    private OffsetDateTime departureTime;
    private OffsetDateTime arrivalTime;
    private TransportationStatus status;
    private String currentLocation;
    private OffsetDateTime currentLocationUpdated;
}
