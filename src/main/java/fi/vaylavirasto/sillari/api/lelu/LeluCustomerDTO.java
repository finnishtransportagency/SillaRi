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
    @Schema(description = "Name of the customer", required = true, example = "Yritys Y")
    private String name;

    @NotBlank
    @Schema(description = "Business ID", required = true, example = "1234567-8")
    private String identifier;

}
