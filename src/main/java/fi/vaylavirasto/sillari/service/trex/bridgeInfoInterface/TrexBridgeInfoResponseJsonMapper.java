package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import fi.vaylavirasto.sillari.model.BridgeImageModel;
import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.service.trex.bridgePicInterface.KuvatiedotItem;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(uses = DateMapper.class)
public interface TrexBridgeInfoResponseJsonMapper {
    @Mappings({
            @Mapping(target="identifier", source = "dto.tunnus"),
            @Mapping(target = "name", source = "dto.nimi"),
            @Mapping(target = "oid", source = "dto.oid"),
            @Mapping(target = "roadAddress", expression = "java(createRoadAddress(dto.getTieosoitteet()))"),
            @Mapping(target = "municipality", expression = "java(createMunicipality(dto.getSijaintikunnat()))"),
            @Mapping(target = "status", source = "dto.tila"),
            @Mapping(target = "coordinates.x", source = "dto.keskipistesijainti.epsg3067.x"),
            @Mapping(target = "coordinates.y", source = "dto.keskipistesijainti.epsg3067.y")
    })
    BridgeModel fromDTOToModel(TrexBridgeInfoResponseJson dto);


    @Mappings({
            @Mapping(target = "id", source = "dto.id"),
            @Mapping(target = "taken", source = "dto.luotu"),
    })
    BridgeImageModel fromDTOToModel(KuvatiedotItem dto);


    default String createRoadAddress(List<TieosoitteetItem> tieosoitteetItems) {
        if (!tieosoitteetItems.isEmpty() && tieosoitteetItems.get(0).getTienumero() != null) {
            TieosoitteetItem tieosoitteetItem = tieosoitteetItems.get(0);
            return "" + tieosoitteetItem.getTienumero() + "-" + tieosoitteetItem.getTieosa() + "-" + tieosoitteetItem.getEtaisyys() + "-" + tieosoitteetItem.getAjorata();
        } else {
            return null;
        }
    }


    default String createMunicipality(List<SijaintikunnatItem> sijaintikunnatItemList) {
        StringBuilder municipality = new StringBuilder();
        try {
            for (SijaintikunnatItem k : sijaintikunnatItemList) {
                municipality.append(k.getNimi()).append(" ");
            }
        } catch (Exception ignored) {
        }
        return municipality.toString().trim();
    }


}
