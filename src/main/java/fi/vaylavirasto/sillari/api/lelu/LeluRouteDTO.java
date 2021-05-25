package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluRouteDTO {
    private Long id;
    private String name;
    private Integer order;
    private Integer transportCount;
    private Boolean alternativeRoute;
    private List<LeluBridgeDTO> bridges;
}
