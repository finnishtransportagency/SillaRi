package fi.vaylavirasto.sillari.api.lelu.supervision;

import fi.vaylavirasto.sillari.model.SupervisionStatusType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class LeluSupervisionStatus {
    @Schema(description = "Status of the supervision, those with status 'REPORT_SIGNED' have report available from /getSupervisionReport ", required = true, example = "REPORT_SIGNED")
    private SupervisionStatusType status;

    @Schema(description = "Status timestamp", required = true, example = "2021-05-26T08:02:36.000Z")
    private OffsetDateTime modifiedDate;

    @Schema(description = "Description of the reason for status change")
    private String reasonText;
}
