package fi.vaylavirasto.sillari.api.lelu;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.RouteModel;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(uses = DateMapper.class)
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="companyId", ignore = true),
            @Mapping(target="company", source = "dto.customer"),
            @Mapping(target="permitNumber", source="dto.number"),
            @Mapping(target="leluVersion", source="dto.version"),
            @Mapping(target="leluLastModifiedDate", source="dto.lastModifiedDate"),
            @Mapping(target="validStartDate", source="dto.validFrom"),
            @Mapping(target="validEndDate", source="dto.validTo"),
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
