package fi.vaylavirasto.sillari.api.lelu.permit;

import fi.vaylavirasto.sillari.api.lelu.LeluRouteWithExcessTransportNumbersResponseDTO;
import fi.vaylavirasto.sillari.model.PermitModel;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class LeluPermitsWithExcessTransportNumbersResponseDTO {

    @Schema(description = "Number identifying the permit", required = true, example = "1234/2021")
    private String number;

    @Schema(description = "Version number of the approved permit, starting from 1.", required = true, example = "1")
    private Integer version;

    @Schema(description = "Uusi rajapinta SillaRiin jota lelu pollaa 'harvoin' esim 1krt / päivä \n" +
            " - palauttaa tiedon : luvalla x reitillä y sillalla z ylitetty ylitysmäärien käyttökerrat  \n" +
            " - palauttaa listan instansseja [reitti-silta-maksimi ylityskertanumero ] jotta lelu osaa käydä hakemassa nämä ", required = true)
    private List<LeluRouteWithExcessTransportNumbersResponseDTO> routes;

    public LeluPermitsWithExcessTransportNumbersResponseDTO(PermitModel permitModel) {
    }
}
