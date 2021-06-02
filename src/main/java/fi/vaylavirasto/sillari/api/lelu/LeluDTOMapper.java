package fi.vaylavirasto.sillari.api.lelu;

import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(uses = DateMapper.class)
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="companyId", ignore = true),
            @Mapping(target="company", source = "dto.customer"),
            @Mapping(target="permitNumber", source="dto.number"),
            @Mapping(target="leluVersion", source="dto.version"),
            @Mapping(target="leluLastModifiedDate", source="dto.lastModifiedDate"),
            @Mapping(target="validStartDate", source="dto.validFrom"),
            @Mapping(target="validEndDate", source="dto.validTo"),
            @Mapping(target="axles", ignore = true)
    })
    PermitModel leluPermitToPermit(LeluPermitDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="businessId", source="dto.identifier"),
            @Mapping(target="permits", ignore = true)
    })
    CompanyModel leluCustomerToCompany(LeluCustomerDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="permitId", ignore = true)
    })
    VehicleModel leluVehicleToVehicle(LeluVehicleDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="permitId", ignore = true)
    })
    AxleChartModel leluAxleChartToAxleChart(LeluAxleChartDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="axleChartId", ignore = true)
    })
    AxleModel leluAxleToAxle(LeluAxleDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="permitId", ignore = true)
    })
    TransportDimensionsModel leluTransportDimensionsToTransportDimensions(LeluTransportDimensionsDTO dto);

    @Mappings({
            @Mapping(target="id", ignore = true),
            @Mapping(target="permitId", ignore = true),
            @Mapping(target="leluId", source="dto.id"),
            @Mapping(target="geojson", ignore = true),
            @Mapping(target="routeBridges", source="dto.bridges"),
            @Mapping(target="crossings", ignore = true),
            @Mapping(target="departureAddress", ignore = true),
            @Mapping(target="arrivalAddress", ignore = true)
    })
    RouteModel leluRouteToRoute(LeluRouteDTO dto);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "routeId", ignore = true),
            @Mapping(target = "bridge.oid", source = "dto.oid"),
            @Mapping(target = "bridge.identifier", source = "dto.identifier"),
            @Mapping(target = "bridge.name", source = "dto.name"),
            @Mapping(target = "bridge.roadAddress", source = "dto.roadAddress"),
            @Mapping(target = "crossingInstruction", source = "dto.additionalInfo")
    })
    RouteBridgeModel leluBridgeToRouteBridge(LeluBridgeDTO dto);

}
