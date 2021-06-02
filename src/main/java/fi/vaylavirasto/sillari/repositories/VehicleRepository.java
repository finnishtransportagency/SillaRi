package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.VehicleMapper;
import fi.vaylavirasto.sillari.model.VehicleModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class VehicleRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    
    public List<VehicleModel> getVehiclesOfPermit(Integer permitID) {
        return dsl.select().from(VehicleMapper.vehicle)
                .where(VehicleMapper.vehicle..eq(vehicleChartID))
                .fetch(new VehicleMapper());
    }
}
