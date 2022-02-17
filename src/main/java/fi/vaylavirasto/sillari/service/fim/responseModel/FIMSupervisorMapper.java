package fi.vaylavirasto.sillari.service.fim.responseModel;

import fi.vaylavirasto.sillari.model.SupervisorModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface FIMSupervisorMapper {
    @Mappings({
            @Mapping(target = "company", source = "dto.customer"),
            @Mapping(target = "permitNumber", source = "dto.number"),
            @Mapping(target = "leluVersion", source = "dto.version"),
            @Mapping(target = "leluLastModifiedDate", source = "dto.lastModifiedDate"),
            @Mapping(target = "validStartDate", source = "dto.validFrom"),
            @Mapping(target = "validEndDate", source = "dto.validTo"),

    })
    SupervisorModel fromDTOToModel(PersonType dto);
}
