
package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluBridgeDTO {

    @Schema(description = "Bridge OID in Taitorakennerekisteri", required = true, example = "1.2.246.578.1.15.400025")
    private String oid;

    @Schema(description = "Bridge identifier in Taitorakennerekisteri", required = true, example = "H-25")
    private String identifier;

    @Schema(description = "Bridge name", required = true, example = "Kaivannon silta")
    private String name;

    @Schema(description = "Bridge road address (road number, section, lane and distance)", example = "00012 204 0 03788")
    private String roadAddress;

    @Schema(description = "Name of the 1st supervisor", example = "Vilja Valvoja")
    private String supervisorName;

    @Schema(description = "Bridge crossing instructions and other possible supervisors", example = "Ajoneuvon keskilinjan oltava 4,25 metrin etäisyydellä idänpuoleisesta kaiteesta.")
    private String additionalInfo;

    @Schema(description = "Bridge supervision")
    private LeluSupervisionDTO supervision;


}
