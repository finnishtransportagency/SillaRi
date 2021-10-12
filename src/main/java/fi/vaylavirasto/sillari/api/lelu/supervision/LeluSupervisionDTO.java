package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;

public class LeluSupervisionDTO {
    @Schema(description = "Bridge crossing supervisor ")
    private LeluSupervisor supervisor;

    @Schema(description = "Status of the supervision, those with status 'SIGNED' have report available from /getSupervisionReport ", example = "SINGNED")
    LeluSupervisionStatus status;

    @Schema(description = "Identifier of a report available from /getSupervisionReport ", example = "123456_abc")
    String reportIdentifier;
}
