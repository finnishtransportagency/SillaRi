package fi.vaylavirasto.sillari.api.lelu.permit;

import fi.vaylavirasto.sillari.api.lelu.supervision.LeluRouteResponseDTO;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(uses = DateMapper.class)
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target="company", source = "dto.customer"),
            @Mapping(target="permitNumber", source="dto.number"),
            @Mapping(target="leluVersion", source="dto.version"),
            @Mapping(target="leluLastModifiedDate", source="dto.lastModifiedDate"),
            @Mapping(target="validStartDate", source="dto.validFrom"),
            @Mapping(target="validEndDate", source="dto.validTo"),

    })
    PermitModel fromDTOToModel(LeluPermitDTO dto);

    @Mappings({
            @Mapping(target="businessId", source="dto.identifier")
    })
    CompanyModel fromDTOToModel(LeluCustomerDTO dto);

    VehicleModel fromDTOToModel(LeluVehicleDTO dto);

    AxleChartModel fromDTOToModel(LeluAxleChartDTO dto);

    AxleModel fromDTOToModel(LeluAxleDTO dto);

    TransportDimensionsModel fromDTOToModel(LeluTransportDimensionsDTO dto);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "leluId", source = "dto.id"),
            @Mapping(target = "routeBridges", source = "dto.bridges"),
    })
    RouteModel fromDTOToModel(LeluRouteDTO dto);

    @Mappings({
            @Mapping(target = "bridge.oid", source = "dto.oid"),
            @Mapping(target = "bridge.identifier", source = "dto.identifier"),
            @Mapping(target = "bridge.name", source = "dto.name"),
            @Mapping(target = "bridge.roadAddress", source = "dto.roadAddress"),
            @Mapping(target = "crossingInstruction", source = "dto.additionalInfo")
    })
    RouteBridgeModel fromDTOToModel(LeluBridgeDTO dto);

    @Mappings({
            @Mapping(target = "streetAddress", source = "address")
    })
    AddressModel fromDTOToModel(LeluAddressDTO dto);

    LeluRouteResponseDTO fromModelToDTO(RouteModel modell);
}
