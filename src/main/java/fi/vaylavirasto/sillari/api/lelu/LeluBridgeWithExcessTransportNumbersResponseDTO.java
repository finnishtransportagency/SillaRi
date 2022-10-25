package fi.vaylavirasto.sillari.api.lelu;

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

    @Schema(description = "Order number of crossing, starting from 1.", example = "1")
    private Integer transportNumberActualMax;
}
