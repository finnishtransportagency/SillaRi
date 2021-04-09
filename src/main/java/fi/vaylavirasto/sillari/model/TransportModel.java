package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class TransportModel {
    private long id;
    private long permitId;
    private long routeId;
    private String name;
}
