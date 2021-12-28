package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.OffsetDateTime;

@Data
@EqualsAndHashCode(callSuper = false)
public class RouteTransportPasswordModel extends BaseModel {
    private Integer id;
    private Integer routeTransportId;
    private String transportPassword;
    private OffsetDateTime validFrom;
    private OffsetDateTime validTo;
}
