package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.ToString;

import java.util.List;
import java.util.Objects;

@Data
@ToString(callSuper = true)
public class OwnListModel extends BaseModel {
    private Integer id;
    private String username;
    private String businessId;
    private String listname;
    private String list;

}
