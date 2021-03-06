package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluBridgeDTO {

    @NotBlank(message = "{bridge.oid.not.blank}")
    @Schema(description = "Bridge OID in Taitorakennerekisteri", required = true, example = "1.2.246.578.1.15.400025")
    private String oid;

    @NotBlank(message = "{bridge.identifier.not.blank}")
    @Schema(description = "Bridge identifier in Taitorakennerekisteri", required = true, example = "H-25")
    private String identifier;

    @NotBlank(message = "{bridge.name.not.blank}")
    @Schema(description = "Bridge name", required = true, example = "Kaivannon silta")
    private String name;

    @Schema(description = "Bridge road address (road number, section, lane and distance)", example = "00012 204 0 03788")
    private String roadAddress;

    @Schema(description = "Name of the 1st supervisor", example = "Vilja Valvoja")
    private String supervisorName;

    @Schema(description = "Bridge crossing instructions and other possible supervisors", example = "Ajoneuvon keskilinjan oltava 4,25 metrin etäisyydellä idänpuoleisesta kaiteesta.")
    private String additionalInfo;

    public LeluBridgeDTO() {
    }

    public LeluBridgeDTO(String oid, String identifier, String name, String roadAddress, String supervisorName, String additionalInfo) {
        this.oid = oid;
        this.identifier = identifier;
        this.name = name;
        this.roadAddress = roadAddress;
        this.supervisorName = supervisorName;
        this.additionalInfo = additionalInfo;
    }

}
