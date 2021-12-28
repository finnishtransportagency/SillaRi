package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class SupervisorModel extends BaseModel {
    private Integer id;
    private String firstName;
    private String lastName;
    private String username;

    // For supervision supervisor
    private Integer priority;
}
