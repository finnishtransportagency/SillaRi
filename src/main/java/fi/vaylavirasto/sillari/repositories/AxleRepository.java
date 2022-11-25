package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.AxleMapper;
import fi.vaylavirasto.sillari.model.AxleModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AxleRepository {
    @Autowired
    private DSLContext dsl;

    public List<AxleModel> getAxlesOfChart(Integer axleChartID) {
        return dsl.select().from(TableAlias.axle)
                .where(TableAlias.axle.AXLE_CHART_ID.eq(axleChartID))
                .orderBy(TableAlias.axle.AXLE_NUMBER)
                .fetch(new AxleMapper());
    }
}
