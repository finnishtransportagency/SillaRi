package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class OwnListModel {
    private Integer id;
    private String  contractBusinessId;
    private Integer supervisionId;

    // Parents
    SupervisionModel supervision;
}
