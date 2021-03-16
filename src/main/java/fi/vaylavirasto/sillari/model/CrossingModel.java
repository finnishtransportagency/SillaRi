package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class CrossingModel {
    private int id;
    private BridgeModel bridge;
    private boolean drivingLineInfo;
    private boolean speedInfo;
    private boolean exceptionsInfo;
    private boolean describe;
    private String drivingLineInfoDesc;
    private String speedInfoDesc;
    private String exceptionsInfoDesc;
    private String extraInfoDesc;
}
