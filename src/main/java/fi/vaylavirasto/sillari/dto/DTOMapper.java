package fi.vaylavirasto.sillari.dto;

import fi.vaylavirasto.sillari.model.CompanyModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface DTOMapper {
    @Mappings({
            @Mapping(target="companyId", source="model.id")
    })
    CompanyTransportsDTO fromModelToDTO(CompanyModel model);

}
