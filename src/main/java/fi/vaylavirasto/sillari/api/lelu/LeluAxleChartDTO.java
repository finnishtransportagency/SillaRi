package fi.vaylavirasto.sillari.api.lelu;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Getter
@Setter
@ToString
public class LeluAxleChartDTO {

    @Valid
    @NotEmpty
    private List<LeluAxleDTO> axles;

}
