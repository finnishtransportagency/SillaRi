package fi.vaylavirasto.sillari.api.lelu.supervision;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class LeluSupervisionReportDTO {

    @Schema(description = "Driving line complied with ", example  = "false")
    private Boolean drivingLineOk; // Ajolinjaa on noudatettu

    @Schema(description = "Why is the driving line not complied with? ", example  = "Ei voitu ajaa ihan keskellä.")
    private String drivingLineInfo; // Miksi ajolinjaa ei noudatettu?

    @Schema(description = "Speed limit complied with ", example  = "false")
    private Boolean speedLimitOk;    // Ajonopeutta on noudatettu

    @Schema(description = "Why is the speed limit not complied with? ", example  = "Piti mennä kovempaa.")
    private String speedLimitInfo;    // Miksi ajonopeutta ei noudatettu?",

    @Schema(description = "Anomalies ", example  = "true")
    private Boolean anomalies;         // Poikkeavia havaintoja

    @Schema(description = "Specify anomalies ", example  = "Slta natisi huomattavasti.")
    private String anomaliesDescription;  // Tarkenna poikkeavia havaintoja

    @Schema(description = "Surface damage ", example  = "false")
    private Boolean surfaceDamage;     // Päällystevaurio

    @Schema(description = "Joint damage ", example  = "true")
    private Boolean jointDamage;       // Liikuntasauman rikkoutuminen

    @Schema(description = "Permanent bend or other displacemen ", example  = "true")
    private Boolean bendOrDisplacement; // Pysyvä taipuma tai muu siirtymä

    @Schema(description = "Something else ", example  = "true")
    private Boolean otherObservations;  // Jotain muuta, mitä?

    @Schema(description = "Something else, what? ", example  = "Tuki numero 2 natisi.")
    private String otherObservationsInfo; // Jotain muuta, mitä?

    @Schema(description = "Additional information ", example  = "Aukon 2 laatan halkeama kasvoi 2mm")
    private String additionalInfo; // Lisätiedot

}
