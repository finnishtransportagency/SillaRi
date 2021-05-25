package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluTransportDimensionsDTO {
    private Double width;
    private Double legth;
    private Double height;
}
