package fi.vaylavirasto.sillari.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.OffsetDateTime;

@Getter
@Setter
@ToString
public class SupervisionMetadataDTO {
    private String objectIdentifier;
    private String objectKey;
    private String filename;
    private OffsetDateTime createdTime;
    private Integer supervisionId;
    private String permitNumber;
    private OffsetDateTime supervisionStartedTime;
    private OffsetDateTime supervisionFinishedTime;
    private Boolean supervisionExceptional;
    private String bridgeName;
    private String bridgeIdentifier;
    private String bridgeOid;
    private Double bridgeXCoordinate;
    private Double bridgeYCoordinate;
    private String bridgeRoadAddress;
}
