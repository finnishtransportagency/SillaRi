package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.VehicleMapper;
import fi.vaylavirasto.sillari.model.VehicleModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VehicleRepository {
    @Autowired
    private DSLContext dsl;

    
    public List<VehicleModel> getVehiclesOfPermit(Integer permitID) {
        return dsl.select().from(TableAlias.vehicle)
                .where(TableAlias.vehicle.PERMIT_ID.eq(permitID))
                .orderBy(TableAlias.vehicle.ORDINAL)
                .fetch(new VehicleMapper());
    }
}
