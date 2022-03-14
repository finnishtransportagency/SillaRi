package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class SupervisorModel extends BaseModel {
    // From supervision supervisor
    private Integer id;
    private String username;
    private Integer priority;

    // From fimrest
    private String firstName;
    private String lastName;

   }
