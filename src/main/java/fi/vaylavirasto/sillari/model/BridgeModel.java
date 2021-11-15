package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class BridgeModel {
    private Integer id;
    private String oid;
    private String identifier;
    private String name;
    private String roadAddress;
    private String municipality;
    private String geojson;
    private String status;
    private Double x;
    private Double y;
    private Integer wkid;
    private List<RouteBridgeModel> routeBridges;
}
