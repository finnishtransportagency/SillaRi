package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Vehicle;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class VehicleMapper implements RecordMapper<Record, VehicleModel> {
    public static final Vehicle vehicle = Tables.VEHICLE.as("v");

    @Nullable
    @Override
    public VehicleModel map(Record record) {
        VehicleModel vehicleModel = new VehicleModel();
        vehicleModel.setId(record.get(vehicle.ID));
        vehicleModel.setType(record.get(vehicle.TYPE));
        vehicleModel.setIdentifier(record.get(vehicle.IDENTIFIER));
        vehicleModel.setPermitId(record.get(vehicle.PERMIT_ID));
        return vehicleModel;
    }
}
