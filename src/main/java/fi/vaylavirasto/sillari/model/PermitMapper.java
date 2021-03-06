package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    public static final Permit permit = Tables.PERMIT.as("pe");
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("td");
    public static final UnloadedTransportDimensions unloadedTransportDimensions = Tables.UNLOADED_TRANSPORT_DIMENSIONS.as("ud");
    public static final Vehicle vehicle = Tables.VEHICLE.as("ve");
    public static final AxleChart axleChart = Tables.AXLE_CHART.as("ac");
    public static final Axle axle = Tables.AXLE.as("ax");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routeBridge = Tables.ROUTE_BRIDGE.as("rbr");

    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(permit.ID));
        permitModel.setCompanyId(record.get(permit.COMPANY_ID));
        permitModel.setPermitNumber(record.get(permit.PERMIT_NUMBER));
        permitModel.setLeluVersion(record.get(permit.LELU_VERSION));
        permitModel.setLeluLastModifiedDate(record.get(permit.LELU_LAST_MODIFIED_DATE));
        permitModel.setValidStartDate(record.get(permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(permit.VALID_END_DATE));
        permitModel.setTransportTotalMass(record.get(permit.TRANSPORT_TOTAL_MASS));
        permitModel.setAdditionalDetails(record.get(permit.ADDITIONAL_DETAILS));
        permitModel.setRoutes(new ArrayList<>());

        TransportDimensionsMapper transportDimensionsMapper = new TransportDimensionsMapper();
        permitModel.setTransportDimensions(transportDimensionsMapper.map(record));

        UnloadedTransportDimensionsMapper unloadedTransportDimensionsMapper = new UnloadedTransportDimensionsMapper();
        permitModel.setUnloadedTransportDimensions(unloadedTransportDimensionsMapper.map(record));

        AxleChartMapper axleChartMapper = new AxleChartMapper();
        permitModel.setAxleChart(axleChartMapper.map(record));
        return permitModel;
    }
}
