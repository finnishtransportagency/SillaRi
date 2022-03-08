package fi.vaylavirasto.sillari.api.lelu.permit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@ToString
public class LeluCompanyAuthorizerDTO {

    @NotBlank(message = "{customer.name.not.blank}")
    @Schema(description = "Name of the company", required = true, example = "Yritys Y")
    private String companyName;

    @NotBlank(message = "{customer.identifier.not.blank}")
    @Schema(description = "Business ID", required = true, example = "1234567-8")
    private String identifier;

    @NotBlank(message = "{authorizer.name.not.blank}")
    @Schema(description = "Name of the authorizer", required = true, example = "Matti Virtanen")
    private String authorizerName;

    @NotBlank(message = "{authorizer.email.not.blank}")
    @Schema(description = "Email of the authorizer", required = true, example = "matti.virtanen@yritys.fi")
    private String authorizerEmail;

    @NotBlank(message = "{authorizer.phone.not.blank}")
    @Schema(description = "Phone number of the authorizer", required = true, example = "050-123456")
    private String authorizerPhone;





}
