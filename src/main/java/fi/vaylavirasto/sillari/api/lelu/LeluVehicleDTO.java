package fi.vaylavirasto.sillari.api.lelu;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluVehicleDTO {

    @NotBlank
    private String type;

    @NotBlank
    private String identifier;

}
