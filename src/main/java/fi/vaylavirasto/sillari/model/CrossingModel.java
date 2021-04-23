package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class CrossingModel {
    private int id;
    private int routeBridgeId;
    private boolean drivingLineInfo;
    private boolean speedInfo;
    private boolean exceptionsInfo;
    private boolean describe;
    private String drivingLineInfoDescription;
    private String speedInfoDescription;
    private String exceptionsInfoDescription;
    private String extraInfoDescription;
    private String started;
    private boolean permanentBendings;
    private boolean twist;
    private boolean damage;
    private boolean draft;
    private List<FileModel> images;
}
