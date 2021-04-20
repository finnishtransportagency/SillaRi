package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class TransportModel {
    private long id;
    private long permitId;
    private long routeId;
    private String name;
    private Double height;
    private Double width;
    private Double length;
    private Double totalMass;
    private List<TransportRegistrationModel> registrations;
    private List<AxleModel> axles;
}
