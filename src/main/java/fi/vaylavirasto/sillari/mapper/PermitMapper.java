package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.*;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    public static final Permit permit = Tables.PERMIT.as("pe");
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("td");
    public static final UnloadedTransportDimensions unloadedTransportDimensions = Tables.UNLOADED_TRANSPORT_DIMENSIONS.as("ud");
    public static final Vehicle vehicle = Tables.VEHICLE.as("ve");
    public static final AxleChart axleChart = Tables.AXLE_CHART.as("ac");
    public static final Axle axle = Tables.AXLE.as("ax");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final RouteBridge routeBridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final RouteTransport routeTransport = Tables.ROUTE_TRANSPORT.as("rtr");

    @Nullable
    @Override
    public PermitModel map(Record record) {
        SimplePermitMapper simplePermitMapper = new SimplePermitMapper();
        PermitModel permitModel = simplePermitMapper.map(record);

        if (permitModel != null) {
            TransportDimensionsMapper transportDimensionsMapper = new TransportDimensionsMapper();
            permitModel.setTransportDimensions(transportDimensionsMapper.map(record));

            UnloadedTransportDimensionsMapper unloadedTransportDimensionsMapper = new UnloadedTransportDimensionsMapper();
            permitModel.setUnloadedTransportDimensions(unloadedTransportDimensionsMapper.map(record));

            AxleChartMapper axleChartMapper = new AxleChartMapper();
            permitModel.setAxleChart(axleChartMapper.map(record));
        }

        return permitModel;
    }
}
