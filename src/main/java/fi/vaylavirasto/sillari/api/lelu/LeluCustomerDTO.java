package fi.vaylavirasto.sillari.api.lelu;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluCustomerDTO {

    @NotBlank
    @Schema(description = "Name of the customer", required = true)
    private String name;

    @NotBlank
    @Schema(description = "Business ID", required = true)
    private String identifier;

}
