package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluRouteDTO {

    @NotNull
    private Long id;

    @NotBlank
    private String name;

    @NotNull
    private Integer order;

    private Integer transportCount;

    private Boolean alternativeRoute;

    @Valid
    @NotEmpty
    private List<LeluBridgeDTO> bridges;

}
