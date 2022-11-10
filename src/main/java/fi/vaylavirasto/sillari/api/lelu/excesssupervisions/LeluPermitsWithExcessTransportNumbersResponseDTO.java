package fi.vaylavirasto.sillari.api.lelu.excesssupervisions;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluPermitsWithExcessTransportNumbersResponseDTO {

    @Schema(description = "Number identifying the permit", example = "1234/2021")
    private String number;

    @Schema(description = "Version number of the approved permit, starting from 1.", example = "1")
    private Integer version;

    @Schema(description = "List of routes that have exceeded the transport count sent from Lelu")
    private List<LeluRouteWithExcessTransportNumbersResponseDTO> routes;

}
