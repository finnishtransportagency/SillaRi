package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class VehicleMapper implements RecordMapper<Record, VehicleModel> {
    @Nullable
    @Override
    public VehicleModel map(Record record) {
        VehicleModel model = new VehicleModel();
        model.setId(record.get(TableAlias.vehicle.ID));
        model.setPermitId(record.get(TableAlias.vehicle.PERMIT_ID));
        model.setType(record.get(TableAlias.vehicle.TYPE));
        model.setIdentifier(record.get(TableAlias.vehicle.IDENTIFIER));
        model.setRowCreatedTime(record.get(TableAlias.vehicle.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.vehicle.ROW_UPDATED_TIME));
        return model;
    }
}
