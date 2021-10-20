package fi.vaylavirasto.sillari.dto;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Data
public class CompanyTransportsDTO {
    private CompanyModel company;
    private List<RouteTransportModel> transports;
    private OffsetDateTime lastOngoingTransportDepartureTime;
    private OffsetDateTime lastFinishedTransportDepartureTime;
    private OffsetDateTime lastFinishedTransportArrivalTime;
    private OffsetDateTime nextPlannedTransportDepartureTime;

    public void setTransportDepartureTimes(List<RouteTransportModel> transports) {
        // Take only ongoing transports into account, effectively all other status types than ARRIVED (PLANNED don't have departureTime)
        OffsetDateTime lastOngoingDepartureTime = transports.stream()
                .filter(transport -> transport.getDepartureTime() != null && transport.getCurrentStatus() != null && !TransportStatusType.ARRIVED.equals(transport.getCurrentStatus().getStatus()))
                .max(Comparator.comparing(RouteTransportModel::getDepartureTime))
                .map(RouteTransportModel::getDepartureTime).orElse(null);

        OffsetDateTime lastFinishedDepartureTime = transports.stream()
                .filter(transport -> transport.getDepartureTime() != null && transport.getCurrentStatus() != null && TransportStatusType.ARRIVED.equals(transport.getCurrentStatus().getStatus()))
                .max(Comparator.comparing(RouteTransportModel::getDepartureTime))
                .map(RouteTransportModel::getDepartureTime).orElse(null);

        OffsetDateTime lastArrivalTime = transports.stream()
                .filter(transport -> transport.getArrivalTime() != null && transport.getCurrentStatus() != null && TransportStatusType.ARRIVED.equals(transport.getCurrentStatus().getStatus()))
                .max(Comparator.comparing(RouteTransportModel::getArrivalTime))
                .map(RouteTransportModel::getArrivalTime).orElse(null);

        OffsetDateTime nextPlannedTime = transports.stream()
                .filter(transport -> transport.getCurrentStatus() != null && TransportStatusType.PLANNED.equals(transport.getCurrentStatus().getStatus()))
                .min(Comparator.comparing(RouteTransportModel::getPlannedDepartureTime))
                .map(RouteTransportModel::getPlannedDepartureTime).orElse(null);

        this.lastOngoingTransportDepartureTime = lastOngoingDepartureTime;
        this.lastFinishedTransportDepartureTime = lastFinishedDepartureTime;
        this.lastFinishedTransportArrivalTime = lastArrivalTime;
        this.nextPlannedTransportDepartureTime = nextPlannedTime;
    }

}