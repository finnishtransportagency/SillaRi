package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluRouteReportsDTO {
    @Schema(description = "List of the route's supervision report statuses and links to report pdfs when available")
    List<LeluBridgeSupervisonReportStatusDTO> bridgeSupervisonReportStatuses;
}
