package fi.vaylavirasto.sillari.service.fim.responseModel;

import fi.vaylavirasto.sillari.model.SupervisorModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mappings;

@Mapper
public interface FIMSupervisorMapper {
    @Mappings({


    })
    SupervisorModel fromDTOToModel(Person dto);
}
