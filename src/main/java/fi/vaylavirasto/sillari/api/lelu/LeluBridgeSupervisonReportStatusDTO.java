package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluBridgeSupervisonReportStatusDTO {
    @Schema(description = "Status of the supervision, those with status 'SIGNED' have report available from /getSupervisionReport ", example = "SINGNED")
    LeluSupervisionStatus status;
    @Schema(description = "Bridge crossing supervisor ")
    LeluSupervisor supervisor;
    @Schema(description = "The supervised bridge")
    LeluBridgeDTO bridge;
    @Schema(description = "Identifier of a report available from /getSupervisionReport ", example = "123456_abc")
    String reportIdentifier;
}
