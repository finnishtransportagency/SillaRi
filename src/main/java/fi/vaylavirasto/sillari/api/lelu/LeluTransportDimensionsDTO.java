package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@ToString
public class LeluTransportDimensionsDTO {

    @NotNull
    private Double width;

    @NotNull
    private Double legth;

    @NotNull
    private Double height;

}
