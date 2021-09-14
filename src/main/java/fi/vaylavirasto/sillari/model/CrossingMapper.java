package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Crossing;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class CrossingMapper implements RecordMapper<Record,CrossingModel> {
    public static final Crossing crossing = Tables.CROSSING.as("cr");

    @Nullable
    @Override
    public CrossingModel map(Record record) {
        CrossingModel crossingModel = new CrossingModel();
        crossingModel.setId(record.get(crossing.ID));
        crossingModel.setRouteBridgeId(record.get(crossing.ROUTE_BRIDGE_ID));
        crossingModel.setDrivingLineInfo(record.get(crossing.DRIVINGLINEINFO));
        crossingModel.setSpeedInfo(record.get(crossing.SPEEDINFO));
        crossingModel.setExceptionsInfo(record.get(crossing.EXCEPTIONSINFO));
        crossingModel.setDescribe(record.get(crossing.DESCRIBE));
        crossingModel.setDrivingLineInfoDescription(record.get(crossing.DRIVINGLINEINFODESCRIPTION));
        crossingModel.setSpeedInfoDescription(record.get(crossing.SPEEDINFODESCRIPTION));
        crossingModel.setExceptionsInfoDescription(record.get(crossing.EXCEPTIONSINFODESCRIPTION));
        crossingModel.setExtraInfoDescription(record.get(crossing.EXTRAINFODESCRIPTION));
        LocalDateTime started = record.get(crossing.STARTED);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm:ss");
        crossingModel.setStarted(started.format(formatter));
        crossingModel.setPermanentBendings(record.get(crossing.PERMANENTBENDINGS));
        crossingModel.setTwist(record.get(crossing.TWIST));
        crossingModel.setDamage(record.get(crossing.DAMAGE));
        crossingModel.setDraft(record.get(crossing.DRAFT));
        return crossingModel;
    }
}
