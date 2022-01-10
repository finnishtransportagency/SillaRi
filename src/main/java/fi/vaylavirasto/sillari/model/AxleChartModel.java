package fi.vaylavirasto.sillari.model;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class AxleChartModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private List<AxleModel> axles;
}
