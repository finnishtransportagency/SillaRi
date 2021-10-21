package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.AxleMapper;
import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AxleRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<AxleModel> getAxlesOfChart(Integer axleChartID) {
        return dsl.select().from(TableAlias.axle)
                .where(TableAlias.axle.AXLE_CHART_ID.eq(axleChartID))
                .fetch(new AxleMapper());
    }
}
