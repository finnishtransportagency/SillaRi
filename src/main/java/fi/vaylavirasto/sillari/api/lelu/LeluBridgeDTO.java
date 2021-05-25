package fi.vaylavirasto.sillari.api.lelu;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluBridgeDTO {

    @NotBlank
    private String oid;

    @NotBlank
    private String identifier;

    @NotBlank
    private String name;

    private String roadAddress;

    private Integer transportNumber;

    private String supervisorName;

    private String additionalInfo;

}
