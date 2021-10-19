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
        VehicleModel vehicleModel = new VehicleModel();
        vehicleModel.setId(record.get(TableAlias.vehicle.ID));
        vehicleModel.setPermitId(record.get(TableAlias.vehicle.PERMIT_ID));
        vehicleModel.setType(record.get(TableAlias.vehicle.TYPE));
        vehicleModel.setIdentifier(record.get(TableAlias.vehicle.IDENTIFIER));
        return vehicleModel;
    }
}
