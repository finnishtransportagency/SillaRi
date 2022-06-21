package fi.vaylavirasto.sillari.api.lelu.permit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluBridgeDTO {

    @NotBlank(message = "{bridge.oid.not.blank}")
    @Schema(description = "Bridge OID in Taitorakennerekisteri", required = true, example = "1.2.246.578.1.15.105512")
    private String oid;

    @NotBlank(message = "{bridge.identifier.not.blank}")
    @Schema(description = "Bridge identifier in Taitorakennerekisteri", required = true, example = "U-5512")
    private String identifier;

    @NotBlank(message = "{bridge.name.not.blank}")
    @Schema(description = "Bridge name", required = true, example = "Maijanojan silta")
    private String name;

    @Schema(description = "Bridge road address (road number, section, lane and distance)", example = "00012 204 0 03788")
    private String roadAddress;

    //@NotNull(message = "{bridge.order.not.null}") TODO add not null when LeLu is ready
    @Schema(description = "Order number of the bridge on the route", required = true, example = "1")
    private Integer orderingNumber;

    @Schema(description = "Name of the 1st supervisor", example = "Vilja Valvoja")
    private String supervisorName;

    @Schema(description = "Bridge crossing instructions and other possible supervisors", example = "Ajoneuvon keskilinjan oltava 4,25 metrin etäisyydellä idänpuoleisesta kaiteesta.")
    private String additionalInfo;

    @Schema(description = "Contract number in LeLu.", example = "12345")
    private Long contractNumber;

    @Schema(description = "Contractor y-tunnus from Harja. Might be missing", example = "1234567-8")
    private String contractBusinessIdentifier;

    @Schema(description = "Order number of crossing, starting from 1.", example = "1")
    //TO DO required field when lelu pää ready
    // @NotNull(message = "{transport.number.not.null}")
    private Integer transportNumber;

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
