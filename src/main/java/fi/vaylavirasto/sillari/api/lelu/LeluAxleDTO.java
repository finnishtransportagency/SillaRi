package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluAxleDTO {
    private Integer axleNumber;
    private Double weight;
    private Double distance;
    private Double maxDistanceToNext;

}
