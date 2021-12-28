package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
public class RouteTransportStatusModel extends BaseModel {
    private Integer id;
    private Integer routeTransportId;
    private TransportStatusType status;
    private OffsetDateTime time;
}
