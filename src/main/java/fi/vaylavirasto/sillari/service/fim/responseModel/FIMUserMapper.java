package fi.vaylavirasto.sillari.service.fim.responseModel;

import fi.vaylavirasto.sillari.auth.SillariUser;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface FIMUserMapper {
    @Mappings({
            @Mapping(target = "firstName", source = "firstName"),
            @Mapping(target = "lastName", source = "lastName"),
            @Mapping(target = "username", source = "accountName")
    })
    SillariUser fromDTOToModel(Person dto);
}
