package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteModel {
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
