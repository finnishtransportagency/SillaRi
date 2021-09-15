package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteModel {
    private Integer id;
    private Integer permitId;
    private Long leluId;
    private String name;
    private Integer transportCount;
    private Boolean alternativeRoute;
    private String geojson;
    private List<RouteBridgeModel> routeBridges;
    private List<CrossingModel> crossings;

    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
}
