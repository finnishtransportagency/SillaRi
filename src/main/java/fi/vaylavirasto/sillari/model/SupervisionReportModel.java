package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class SupervisionReportModel {
    private Integer id;
    private Integer supervisionId;
    private Boolean drivingLineOk;
    private String drivingLineInfo;
    private Boolean speedLimitOk;
    private String speedLimitInfo;
    private Boolean anomalies;
    private String anomaliesDescription;
    private Boolean surfaceDamage;
    private Boolean seamDamage;
    private Boolean bendsDisplacements;
    private Boolean otherObservations;
    private String otherObservationsInfo;
    private String additionalInfo;
    private Boolean draft;
}
