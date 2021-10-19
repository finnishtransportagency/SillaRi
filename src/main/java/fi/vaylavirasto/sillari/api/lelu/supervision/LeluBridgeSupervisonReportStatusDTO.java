package fi.vaylavirasto.sillari.api.lelu.supervision;

import fi.vaylavirasto.sillari.api.lelu.permit.LeluBridgeDTO;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class LeluBridgeSupervisonReportStatusDTO {
    @Schema(description = "Status of the supervision, those with status 'SIGNED' have report available from /getSupervisionReport ", example = "SIGNED")
    LeluSupervisionStatus status;
    @Schema(description = "When signed by supervisor", example = "2021-05-26T08:02:36.000Z")
    private LocalDateTime signedTimeStamp;
    @Schema(description = "Bridge crossing supervisor ")
    LeluSupervisor supervisor;
    @Schema(description = "The supervised bridge")
    LeluBridgeDTO bridge;
    @Schema(description = "Identifier of a report available from /getSupervisionReport ", example = "123456_abc")
    String reportIdentifier;
}
