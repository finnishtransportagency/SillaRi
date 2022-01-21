package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@EqualsAndHashCode(callSuper = false)
@ToString(callSuper = true)
public class AddressModel extends BaseModel {
    private Integer id;
    private String streetAddress;
}
