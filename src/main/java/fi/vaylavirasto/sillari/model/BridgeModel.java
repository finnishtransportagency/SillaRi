package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class BridgeModel {
    private Integer id;
    private String name;
    private String identifier;
    private String municipality;
    private List<RouteBridgeModel> routeBridges;
}
