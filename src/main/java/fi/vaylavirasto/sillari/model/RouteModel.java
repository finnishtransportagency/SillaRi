package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteModel {
    private Integer id;
    private Integer permitId;
    private Long leluId;
    private String name;
    private Integer orderNumber;
    private Integer transportCount;
    private Boolean alternativeRoute;
    private String geojson;
    private List<RouteBridgeModel> routeBridges;
    private List<CrossingModel> crossings;

    // TODO Not from Lelu, how do we get these?
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
}
