package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class SupervisorModel {
    private Integer id;
    private String firstName;
    private String lastName;

    // For supervision supervisor
    private Integer priority;
}
