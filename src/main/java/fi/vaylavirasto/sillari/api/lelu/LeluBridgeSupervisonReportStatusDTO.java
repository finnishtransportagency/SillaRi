package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluBridgeSupervisonReportStatusDTO {
    LeluSupervisionStatus status;
    LeluSupervisor supervisor;
    LeluBridgeDTO bridge;
    String reportIdentifier;
}
