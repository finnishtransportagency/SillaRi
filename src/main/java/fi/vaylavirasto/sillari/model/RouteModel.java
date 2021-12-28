package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class RouteModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private Integer departureAddressId;
    private Integer arrivalAddressId;
    private Long leluId;
    private String name;
    private Integer transportCount;
    private Boolean alternativeRoute;
    private String geojson;
    private List<RouteBridgeModel> routeBridges;

    // Parents
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
    private PermitModel permit;
}
