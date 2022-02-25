package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import lombok.Data;
        import lombok.EqualsAndHashCode;
        import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisionSupervisorModel extends BaseModel {
    private Integer id;
    private String username;
    private Integer priority;
}

