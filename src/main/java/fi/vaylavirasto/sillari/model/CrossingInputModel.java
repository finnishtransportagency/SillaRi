package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class CrossingInputModel {
    private int id;
    private int bridgeId;
    private String started;
    private boolean drivingLineInfo;
    private boolean speedInfo;
    private boolean exceptionsInfo;
    private boolean describe;
    private String drivingLineInfoDesc;
    private String speedInfoDesc;
    private String exceptionsInfoDesc;
    private String extraInfoDesc;
    private String descriptionDesc;
    private boolean permantBendings;
    private boolean twist;
    private boolean damage;
}
