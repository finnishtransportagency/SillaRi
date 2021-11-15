package fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface;

import fi.vaylavirasto.sillari.model.BridgeModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper
public interface TrexBridgeInfoResponseJsonMapper {
    @Mappings({
            @Mapping(target="identifier", source = "dto.tunnus"),
            @Mapping(target="name", source="dto.nimi"),
            @Mapping(target="oid", source="dto.oid"),
            @Mapping(target="roadAddress", expression = "java(createRoadAddress(dto.getTieosoitteet()))"),
            @Mapping(target="municipality", expression = "java(createMunicipality(dto.getSijaintikunnat()))"),
            @Mapping(target="status", source="dto.tila"),
            @Mapping(target="x", source="dto.keskipistesijainti.epsg3067.x"),
            @Mapping(target="y", source="dto.keskipistesijainti.epsg3067.y")
    })
    BridgeModel fromDTOToModel(TrexBridgeInfoResponseJson dto);

    default String createRoadAddress(List<TieosoitteetItem> tieosoitteetItems){
        var tieosoitteetItem = tieosoitteetItems.get(0);
        return ""+tieosoitteetItem.getTienumero()+"-"+tieosoitteetItem.getTieosa()+"-"+tieosoitteetItem.getEtaisyys()+"-"+tieosoitteetItem.getAjorata();
    }

    default String createMunicipality(List<SijaintikunnatItem> sijaintikunnatItemList){
        String municipality ="";
        try {
            for (SijaintikunnatItem k : sijaintikunnatItemList) {
                municipality += k.getNimi() + " ";
            }
        } catch (Exception e){

        }
        return municipality.trim();
    }
}
