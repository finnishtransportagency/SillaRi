package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteModel {
    private Integer id;
    private long leluId;
    private long permitId;
    private String name;
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
    private String geojson;
    private List<RouteBridgeModel> routeBridges;
    private List<TransportDimensionsModel> transportDimensions;
    private List<CrossingModel> crossings;
}
