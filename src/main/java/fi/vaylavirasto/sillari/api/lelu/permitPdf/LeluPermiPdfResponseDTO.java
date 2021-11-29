package fi.vaylavirasto.sillari.api.lelu.permitPdf;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;

public class LeluPermiPdfResponseDTO {
    @Schema(description = "Permit ID in SillaRi", example = "737")
    private Long permitId;

    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @Schema(description = "Response success message", example = "Lupa pdf ladattu")
    private String message;
}
