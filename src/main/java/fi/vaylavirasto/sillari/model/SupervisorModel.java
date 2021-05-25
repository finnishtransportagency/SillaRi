package fi.vaylavirasto.sillari.model;

import lombok.Data;
import java.util.List;

@Data
public class SupervisorModel {
    private long id;
    private String firstName;
    private String lastName;
    private List<SupervisionModel> supervisions;
}