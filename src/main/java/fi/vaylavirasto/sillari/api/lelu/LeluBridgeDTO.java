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

    @NotBlank
    @Schema(description = "Bridge OID in Taitorakennerekisteri", required = true)
    private String oid;

    @NotBlank
    @Schema(description = "Bridge identifier in Taitorakennerekisteri", required = true)
    private String identifier;

    @NotBlank
    @Schema(description = "Bridge name", required = true)
    private String name;

    @Schema(description = "Bridge road address (road number, lane, section and distance)")
    private String roadAddress;

    @Schema(description = "Name of the 1st supervisor")
    private String supervisorName;

    @Schema(description = "Bridge crossing instructions and other possible supervisors")
    private String additionalInfo;

}
