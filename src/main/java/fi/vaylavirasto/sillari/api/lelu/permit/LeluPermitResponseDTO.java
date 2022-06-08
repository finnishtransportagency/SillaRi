package fi.vaylavirasto.sillari.api.lelu.permit;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Getter
@Setter
@ToString
public class LeluPermitResponseDTO {

    @Schema(description = "Permit ID in SillaRi", example = "1")
    private Integer permitId;

    @Schema(description = "Number identifying the permit", example = "1234/2021")
    private String permitNumber;

    @Schema(description = "Status of the permit, CREATED/NEW_VERSION_CREATED", example = "CREATED")
    private LeluPermitStatus status;

    @Schema(description = "When the request was received", example = "2021-06-01T09:00:00.000Z")
    private LocalDateTime timestamp;

    public LeluPermitResponseDTO() {
    }

    public LeluPermitResponseDTO(String permitNumber, LocalDateTime timestamp) {
        this.permitNumber = permitNumber;
        this.timestamp = timestamp;
    }

}
