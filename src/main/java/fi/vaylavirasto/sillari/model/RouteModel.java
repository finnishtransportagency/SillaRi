package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class RouteModel {
    private long id;
    private long permitId;
    private String name;
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
    private String departureTime;
    private String arrivalTime;
    private List<RouteBridgeModel> routeBridges;
    private List<TransportDimensionsModel> transportDimensions;
    private List<CrossingModel> crossings;
}
