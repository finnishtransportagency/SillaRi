package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.model.VehicleRole;
import fi.vaylavirasto.sillari.model.VehicleRoleConverter;
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
        vehicleModel.setOrdinal(record.get(TableAlias.vehicle.ORDINAL));
        vehicleModel.setType(record.get(TableAlias.vehicle.TYPE));
        vehicleModel.setRole(record.get(TableAlias.vehicle.ROLE, new VehicleRoleConverter(String.class, VehicleRole.class)));
        vehicleModel.setIdentifier(record.get(TableAlias.vehicle.IDENTIFIER));
        return vehicleModel;
    }
}
