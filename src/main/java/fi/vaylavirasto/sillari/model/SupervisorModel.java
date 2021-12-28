package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisorModel extends BaseModel {
    private Integer id;
    private String firstName;
    private String lastName;
    private String username;

    // For supervision supervisor
    private Integer priority;
}
