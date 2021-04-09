package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class CrossingInputModel {
    private int id;
    private int bridgeId;
    private int routeId;
    private String started;
    private boolean drivingLineInfo;
    private boolean speedInfo;
    private boolean exceptionsInfo;
    private boolean describe;
    private String drivingLineInfoDescription;
    private String speedInfoDescription;
    private String exceptionsInfoDescription;
    private String extraInfoDescription;
    private boolean permanentBendings;
    private boolean twist;
    private boolean damage;
    private boolean draft;
}
