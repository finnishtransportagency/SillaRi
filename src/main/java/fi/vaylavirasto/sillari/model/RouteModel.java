package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class RouteModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private Integer departureAddressId;
    private Integer arrivalAddressId;
    private Long leluId;
    private Integer ordinal;
    private String name;
    private Integer transportCount;
    private Boolean alternativeRoute;
    private String geojson;
    private List<RouteBridgeModel> routeBridges;
    private List<RouteTransportNumberModel> routeTransportNumbers;

    // Parents
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
    private PermitModel permit;

    // Only for use in UI
    private Integer nextAvailableTransportNumber;
}
