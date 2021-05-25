package fi.vaylavirasto.sillari.api.lelu;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluCustomerDTO {

    @NotBlank
    private String name;

    @NotBlank
    private String identifier;

}
