package fi.vaylavirasto.sillari.model;
import fi.vaylavirasto.sillari.model.BridgeModel;

import fi.vaylavirasto.sillari.model.tables.Bridge;
import fi.vaylavirasto.sillari.model.tables.Crossing;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CrossingMapper implements RecordMapper<Record,CrossingModel> {
    public static final Crossing crossing = Tables.CROSSING.as("c");
    public static final Bridge bridge = Tables.BRIDGE.as("b");

    @Nullable
    @Override
    public CrossingModel map(Record record) {
        CrossingModel crossingModel = new CrossingModel();
        crossingModel.setId(record.get(crossing.ID));
        crossingModel.setDrivingLineInfo(record.get(crossing.DRIVINGLINEINFO));
        crossingModel.setSpeedInfo(record.get(crossing.SPEEDINFO));
        crossingModel.setExceptionsInfo(record.get(crossing.EXCEPTIONSINFO));
        crossingModel.setDescribe(record.get(crossing.DESCRIBE));
        crossingModel.setDrivingLineInfoDescription(record.get(crossing.DRIVINGLINEINFODESCRIPTION));
        crossingModel.setSpeedInfoDescription(record.get(crossing.SPEEDINFODESCRIPTION));
        crossingModel.setExceptionsInfoDescription(record.get(crossing.EXCEPTIONSINFODESCRIPTION));
        crossingModel.setExtraInfoDescription(record.get(crossing.EXTRAINFODESCRIPTION));
        LocalDateTime started = record.get(crossing.STARTED);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm");
        crossingModel.setStarted(started.format(formatter));
        crossingModel.setPermanentBendings(record.get(crossing.PERMANENTBENDINGS));
        crossingModel.setTwist(record.get(crossing.TWIST));
        crossingModel.setDamage(record.get(crossing.DAMAGE));

        BridgeModel bridgeModel = new BridgeModel();
        bridgeModel.setId(record.get(bridge.ID));
        bridgeModel.setName(record.get(bridge.NAME));
        bridgeModel.setShortName(record.get(bridge.SHORTNAME));

        crossingModel.setBridge(bridgeModel);
        RouteModel routeModel = new RouteModel();
        routeModel.setId(record.get(crossing.ROUTE_ID));
        crossingModel.setRoute(routeModel);

        return crossingModel;
    }
}
