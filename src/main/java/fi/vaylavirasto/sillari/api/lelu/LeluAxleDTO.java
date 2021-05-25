package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluAxleDTO {

    @NotNull
    private Integer axleNumber;

    @NotNull
    private Double weight;

    @NotNull
    private Double distance;

    private Double maxDistanceToNext;

}
