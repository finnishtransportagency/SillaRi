package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
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
    @Schema(description = "List of axles", required = true)
    private List<LeluAxleDTO> axles;

}
