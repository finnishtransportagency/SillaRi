package fi.vaylavirasto.sillari.api.lelu.permitPdf;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class LeluPermiPdfResponseDTO {
    @Schema(description = "Permit number", example = "lelu lupa 123")
    private String permitNumber;

    @Schema(description = "Permit version in SillaRi", example = "2")
    private Integer permitVersion;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Schema(description = "Response success message", example = "Lupa pdf ladattu")
    private String message;
}
