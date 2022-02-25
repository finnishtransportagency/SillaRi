package fi.vaylavirasto.sillari.service.fim.responseModel;

import fi.vaylavirasto.sillari.model.SupervisorModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface FIMSupervisorMapper {
    @Mappings({
            @Mapping(target = "firstName", source = "firstName"),
            @Mapping(target = "lastName", source = "lastName"),
            @Mapping(target = "username", source = "accountName")
    })
    SupervisorModel fromDTOToModel(Person dto);
}
