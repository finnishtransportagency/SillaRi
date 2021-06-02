package fi.vaylavirasto.sillari.model;
import lombok.Data;

import java.util.List;

@Data
public class AxleChartModel {
    private Integer id;
    private Integer permitId;
    private List<AxleModel> axles;
}
