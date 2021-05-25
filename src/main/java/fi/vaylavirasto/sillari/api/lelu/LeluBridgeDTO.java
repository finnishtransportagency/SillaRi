package fi.vaylavirasto.sillari.api.lelu;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString(callSuper = true)
public class LeluBridgeDTO {
    private String oid;
    private String identifier;
    private String name;
    private String roadAddress;
    private Integer transportNumber;
    private String supervisorName;
    private String additionalInfo;

}
