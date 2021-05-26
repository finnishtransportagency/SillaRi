package fi.vaylavirasto.sillari.api.lelu;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target="permitNumber", source="dto.number"),
    })
    PermitModel leluPermitToPermit(LeluPermitDTO dto);

    @Mappings({
            @Mapping(target="businessId", source="dto.identifier"),
    })
    CompanyModel leluCustomerToCompany(LeluCustomerDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="leluId", source="dto.id")
    })
    RouteModel leluRouteToRoute(LeluRouteDTO dto);

}
