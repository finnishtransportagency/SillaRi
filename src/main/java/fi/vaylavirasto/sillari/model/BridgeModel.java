package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class BridgeModel {
    private long id;
    private String name;
    private String identifier;
    private List<RouteBridgeModel> routeBridges;
}
