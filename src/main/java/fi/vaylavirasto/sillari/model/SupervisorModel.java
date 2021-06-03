package fi.vaylavirasto.sillari.model;

import lombok.Data;
import java.util.List;

@Data
public class SupervisorModel {
    private Integer id;
    private String firstName;
    private String lastName;
    private List<SupervisionModel> supervisions;
}