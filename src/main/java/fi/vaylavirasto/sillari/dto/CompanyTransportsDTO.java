package fi.vaylavirasto.sillari.dto;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.RouteTransportModel;
import lombok.Data;

import java.util.List;

@Data
public class CompanyTransportsDTO {
    private CompanyModel company;
    private List<RouteTransportModel> transports;

    public CompanyTransportsDTO() {
    }

    public CompanyTransportsDTO(CompanyModel company, List<RouteTransportModel> transports) {
        this.company = company;
        this.transports = transports;
    }
}
