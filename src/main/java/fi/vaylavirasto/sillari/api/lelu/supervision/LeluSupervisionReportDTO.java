package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluSupervisionReportDTO {

    @Schema(description = "Driving line complied with ")
    private Boolean drivingLineOk; // Ajolinjaa on noudatettu

    @Schema(description = "Why is the driving line not complied with? ")
    private String drivingLineInfo; // Miksi ajolinjaa ei noudatettu?

    @Schema(description = "Speed limit complied with ")
    private Boolean speedLimitOk;    // Ajonopeus on noudatettu

    @Schema(description = "Why is the speed limit not complied with? ")
    private String speedLimitInfo;    // Miksi ajonopeutta ei noudatettu?",

    @Schema(description = "Anomalies ")
    private Boolean anomalies;         // Poikkeavia havaintoja

    @Schema(description = "Specify anomalies ")
    private String anomaliesDescription;  // Tarkenna poikkeavia havaintoja

    @Schema(description = "Surface damage ")
    private Boolean surfaceDamage;     // Päällystevaurio

    @Schema(description = "Joint damage ")
    private Boolean jointDamage;       // Liikuntasauman rikkoutuminen

    @Schema(description = "Permanent bend or other displacemen ")
    private Boolean bendOrDisplacement; // Pysyvä taipuma tai muu siirtymä

    @Schema(description = "Something else ")
    private Boolean otherObservations;  // Jotain muuta, mitä?

    @Schema(description = "Something else, what? ")
    private String otherObservationsInfo; // Jotain muuta, mitä?

    @Schema(description = "Additional information ")
    private String additionalInfo; // Lisätiedot

}
