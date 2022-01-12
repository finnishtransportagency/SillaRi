
package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluBridgeResponseDTO {

    @Schema(description = "Bridge OID in Taitorakennerekisteri", example = "1.2.246.578.1.15.400025")
    private String oid;

    @Schema(description = "Bridge identifier in Taitorakennerekisteri",  example = "H-25")
    private String identifier;

    @Schema(description = "Bridge name", example = "Kaivannon silta")
    private String name;

    @Schema(description = "Bridge road address (road number, section, lane and distance)", example = "00012 204 0 03788")
    private String roadAddress;

    @Schema(description = "Bridge supervisions in the order when planned supervision was created")
    private List<LeluSupervisionDTO> supervisions;


}
