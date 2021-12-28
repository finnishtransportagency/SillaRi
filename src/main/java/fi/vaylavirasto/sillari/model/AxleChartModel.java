package fi.vaylavirasto.sillari.model;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = false)
public class AxleChartModel extends BaseModel {
    private Integer id;
    private Integer permitId;
    private List<AxleModel> axles;
}
