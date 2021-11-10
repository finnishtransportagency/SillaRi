package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import fi.vaylavirasto.sillari.model.BridgeModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper
public interface TrexBridgeInfoResponseJsonMapper {
    @Mappings({
            @Mapping(target="identifier", source = "dto.tunnus"),
            @Mapping(target="name", source="dto.nimi"),
            @Mapping(target="roadAddress", expression = "java(createRoadAddress(dto.getTieosoitteet))"),
            @Mapping(target="municipality", source="dto.lastModifiedDate")
    })
    BridgeModel fromDTOToModel(TrexBridgeInfoResponseJson dto);

    default String createRoadAddress
}
