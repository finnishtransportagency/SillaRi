package fi.vaylavirasto.sillari.util;

import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.*;

public class TableAlias {
    public static final Company company = Tables.COMPANY.as("co");
    public static final Permit permit = Tables.PERMIT.as("pe");
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("td");
    public static final UnloadedTransportDimensions unloadedTransportDimensions = Tables.UNLOADED_TRANSPORT_DIMENSIONS.as("ud");
    public static final Vehicle vehicle = Tables.VEHICLE.as("ve");
    public static final AxleChart axleChart = Tables.AXLE_CHART.as("ac");
    public static final Axle axle = Tables.AXLE.as("ax");
    public static final Route route = Tables.ROUTE.as("ro");
    public static final Address departureAddress = Tables.ADDRESS.as("da");
    public static final Address arrivalAddress = Tables.ADDRESS.as("aa");
    public static final RouteBridge routeBridge = Tables.ROUTE_BRIDGE.as("rbr");
    public static final Bridge bridge = Tables.BRIDGE.as("br");
    public static final BridgeImage bridgeImage = Tables.BRIDGE_IMAGE.as("bi");
    public static final RouteTransport routeTransport = Tables.ROUTE_TRANSPORT.as("rtr");
    public static final RouteTransportNumber routeTransportNumber = Tables.ROUTE_TRANSPORT_NUMBER.as("rtn");
    public static final RouteTransportNumberView routeTransportNumberView = Tables.ROUTE_TRANSPORT_NUMBER_VIEW.as("rtv");
    public static final RouteTransportStatus transportStatus = Tables.ROUTE_TRANSPORT_STATUS.as("rts");
    public static final RouteTransportPassword routeTransportPassword = Tables.ROUTE_TRANSPORT_PASSWORD.as("rtp");
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");
    public static final SupervisionStatus supervisionStatus = Tables.SUPERVISION_STATUS.as("sns");
    public static final SupervisionReport supervisionReport = Tables.SUPERVISION_REPORT.as("snr");
    public static final SupervisionImage supervisionImage = Tables.SUPERVISION_IMAGE.as("sni");
    public static final SupervisionPdf supervisionPdf = Tables.SUPERVISION_PDF.as("snp");
    public static final OwnList ownList = Tables.OWN_LIST.as("ol");
}
