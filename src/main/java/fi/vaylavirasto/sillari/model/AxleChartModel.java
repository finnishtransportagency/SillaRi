package fi.vaylavirasto.sillari.model;
import lombok.Data;

import java.util.List;

@Data
public class AxleChartModel {
    private long id;
    private long permitId;
    private List<AxleModel> axles;
}
