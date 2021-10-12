package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class LeluSupervisionStatus {
    @Schema(description = "Status of the supervision, those with status 'SIGNED' have report available from /getSupervisionReport ", example = "SINGNED")
    private LeluSupervisionStatusType status;
    @Schema(description = "Status timestamp", example = "2021-05-26T08:02:36.000Z")
    private OffsetDateTime time;
}



