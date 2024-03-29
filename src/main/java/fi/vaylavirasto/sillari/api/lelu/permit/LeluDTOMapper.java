package fi.vaylavirasto.sillari.api.lelu.permit;

import fi.vaylavirasto.sillari.api.lelu.excesssupervisions.LeluBridgeWithExcessTransportNumbersResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.excesssupervisions.LeluRouteWithExcessTransportNumbersResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.excesssupervisions.LeluPermitsWithExcessTransportNumbersResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluBridgeSupervisionResponseDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluSupervisionReportDTO;
import fi.vaylavirasto.sillari.api.lelu.supervision.LeluSupervisionStatus;
import fi.vaylavirasto.sillari.model.*;
import fi.vaylavirasto.sillari.util.DateMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(uses = DateMapper.class)
public interface LeluDTOMapper {

    @Mappings({
            @Mapping(target = "company", source = "dto.customer"),
            @Mapping(target = "permitNumber", source = "dto.number"),
            @Mapping(target = "leluVersion", source = "dto.version"),
            @Mapping(target = "leluLastModifiedDate", source = "dto.lastModifiedDate"),
            @Mapping(target = "validStartDate", source = "dto.validFrom"),
            @Mapping(target = "validEndDate", source = "dto.validTo"),

    })
    PermitModel fromDTOToModel(LeluPermitDTO dto);

    @Mappings({
            @Mapping(target = "businessId", source = "dto.identifier")
    })
    CompanyModel fromDTOToModel(LeluCustomerDTO dto);

    VehicleModel fromDTOToModel(LeluVehicleDTO dto);

    AxleChartModel fromDTOToModel(LeluAxleChartDTO dto);

    AxleModel fromDTOToModel(LeluAxleDTO dto);

    TransportDimensionsModel fromDTOToModel(LeluTransportDimensionsDTO dto);

    @Mappings({
            @Mapping(target = "id", ignore = true),
            @Mapping(target = "leluId", source = "dto.id"),
            @Mapping(target = "ordinal", source = "dto.orderingNumber"),
            @Mapping(target = "routeBridges", source = "dto.bridges"),
    })
    RouteModel fromDTOToModel(LeluRouteDTO dto);

    @Mappings({
            @Mapping(target = "bridge.oid", source = "dto.oid"),
            @Mapping(target = "bridge.identifier", source = "dto.identifier"),
            @Mapping(target = "bridge.name", source = "dto.name"),
            @Mapping(target = "bridge.roadAddress", source = "dto.roadAddress"),
            @Mapping(target = "ordinal", source = "dto.orderingNumber"),
            @Mapping(target = "crossingInstruction", source = "dto.additionalInfo"),
            @Mapping(target = "contractBusinessId", source = "dto.contractBusinessIdentifier"),
            @Mapping(target = "transportNumber", source = "dto.transportNumber")
    })
    RouteBridgeModel fromDTOToModel(LeluBridgeDTO dto);

    @Mappings({
            @Mapping(target = "streetAddress", source = "address")
    })
    AddressModel fromDTOToModel(LeluAddressDTO dto);


    @Mappings({
            @Mapping(target = "reasonText", source = "model.reason"),
            @Mapping(target = "modifiedDate", source = "model.time"),
    })
    LeluSupervisionStatus fromModelToDTO(SupervisionStatusModel model);

    @Mappings({
        @Mapping(target = "supervisionStatus", source = "model.currentStatus"),
        @Mapping(target = "reportId", source = "model.id"),
        @Mapping(target = "supervisionReport", source = "model.report"),
        @Mapping(target = "supervisor", source = "model.supervisorCompany"),
    })
    LeluBridgeSupervisionResponseDTO fromModelToDTO2(SupervisionModel model);

    @Mappings({
            @Mapping(target = "drivingLineOk", source = "model.drivingLineOk"),
            @Mapping(target = "drivingLineInfo", source = "model.drivingLineInfo"),
            @Mapping(target = "speedLimitOk", source = "model.speedLimitOk"),
            @Mapping(target = "speedLimitInfo", source = "model.speedLimitInfo"),
            @Mapping(target = "anomalies", source = "model.anomalies"),
            @Mapping(target = "anomaliesDescription", source = "model.anomaliesDescription"),
            @Mapping(target = "surfaceDamage", source = "model.surfaceDamage"),
            @Mapping(target = "jointDamage", source = "model.jointDamage"),
            @Mapping(target = "bendOrDisplacement", source = "model.bendOrDisplacement"),
            @Mapping(target = "otherObservations", source = "model.otherObservations"),
            @Mapping(target = "otherObservationsInfo", source = "model.otherObservationsInfo"),
            @Mapping(target = "additionalInfo", source = "model.additionalInfo")
    })
    LeluSupervisionReportDTO fromModelToDTO(SupervisionReportModel model);

    @Mappings({
            @Mapping(target = "number", source = "model.permitNumber"),
            @Mapping(target = "version", source = "model.leluVersion"),
            @Mapping(target = "routes", source = "model.routes")
    })
    LeluPermitsWithExcessTransportNumbersResponseDTO fromModelTODTO(PermitModel model);

    @Mappings({
            @Mapping(target = "id", source = "model.leluId"),
            @Mapping(target = "name", source = "model.name"),
            @Mapping(target = "transportCount", source = "model.transportCount"),
            @Mapping(target = "routeBridges", source = "model.routeBridges")
    })
    LeluRouteWithExcessTransportNumbersResponseDTO fromModelTODTO(RouteModel model);

    @Mappings({
            @Mapping(target = "oid", source = "model.bridge.oid"),
            @Mapping(target = "identifier", source = "model.bridge.identifier"),
            @Mapping(target = "transportNumberActualMax", source = "model.transportNumber"),
            @Mapping(target = "name", source = "model.bridge.name")
    })
    LeluBridgeWithExcessTransportNumbersResponseDTO fromModelTODTO(RouteBridgeModel model);

}
