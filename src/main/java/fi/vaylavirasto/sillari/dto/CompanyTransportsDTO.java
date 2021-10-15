package fi.vaylavirasto.sillari.dto;

import fi.vaylavirasto.sillari.model.RouteTransportModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import lombok.Data;

import java.time.OffsetDateTime;
import java.util.Comparator;
import java.util.List;

@Data
public class CompanyTransportsDTO {
    private Integer companyId;
    private String name;
    private String businessId;
    private OffsetDateTime ongoingTransportDepartureTime;
    private OffsetDateTime nextPlannedTransportDepartureTime;
    private List<RouteTransportModel> transports;

    public void setTransportDepartureTimes(List<RouteTransportModel> transports) {
        OffsetDateTime nextPlannedTime = transports.stream()
                .filter(transport -> TransportStatusType.PLANNED.equals(transport.getCurrentStatus().getStatus()))
                .min(Comparator.comparing(RouteTransportModel::getPlannedDepartureTime))
                .map(RouteTransportModel::getPlannedDepartureTime).orElse(null);
        this.nextPlannedTransportDepartureTime = nextPlannedTime;
    }

}
