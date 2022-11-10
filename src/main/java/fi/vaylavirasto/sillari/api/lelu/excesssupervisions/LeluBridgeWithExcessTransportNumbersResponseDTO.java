package fi.vaylavirasto.sillari.api.lelu.excesssupervisions;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluBridgeWithExcessTransportNumbersResponseDTO {
    @Schema(description = "Bridge OID in Taitorakennerekisteri", required = true, example = "1.2.246.578.1.15.105512")
    private String oid;

    @Schema(description = "Bridge identifier in Taitorakennerekisteri", required = true, example = "U-5512")
    private String identifier;

    @Schema(description = "Bridge name", required = true, example = "Maijanojan silta")
    private String name;

    @Schema(description = "Maximum transport number done for this bridge on this route", example = "3")
    private Integer transportNumberActualMax;
}
