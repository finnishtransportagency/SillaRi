package fi.vaylavirasto.sillari.api.lelu;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.PermitModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target="permitNumber", source="dto.number"),
    })
    PermitModel leluPermitToPermit(LeluPermitDTO dto);

    CompanyModel leluCustomerToCompany(LeluCustomerDTO dto);

}
