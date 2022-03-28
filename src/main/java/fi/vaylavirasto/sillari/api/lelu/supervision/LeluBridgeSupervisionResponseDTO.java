package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluBridgeSupervisionResponseDTO {
    @Schema(description = "Bridge crossing supervisor ")
    private LeluSupervisor supervisor;

    @Schema(description = "Status of the supervision, those with status 'REPORT_SIGNED' have report available from /getSupervisionReport ")
    LeluSupervisionStatus supervisionStatus;

    @Schema(description = "Identifier of a report available from /getSupervisionReport ", example = "123456")
    Long reportId;

    @Schema(description = "Supervision report in json format")
    LeluSupervisionReportDTO supervisionReport;

    @Schema(description = "Supervision report has exceptional values")
    private boolean exceptional=false;

    @Schema(description = "Order number of crossing, provided by lelu in incoming permit->route->bridge.", example = "1")
    private Integer transportNumber;
}
