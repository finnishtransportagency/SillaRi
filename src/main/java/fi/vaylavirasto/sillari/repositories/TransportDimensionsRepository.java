package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.TransportDimensionsMapper;
import fi.vaylavirasto.sillari.model.TransportDimensionsModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TransportDimensionsRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public TransportDimensionsModel getTransportDimensionsById(int id) {
        return dsl.selectFrom(TableAlias.transportDimensions)
                .where(TableAlias.transportDimensions.ID.eq(id))
                .fetchOne(new TransportDimensionsMapper());
    }

    public TransportDimensionsModel getTransportDimensionsByPermitId(int permitId) {
        return dsl.selectFrom(TableAlias.transportDimensions)
                .where(TableAlias.transportDimensions.PERMIT_ID.eq(permitId))
                .fetchOne(new TransportDimensionsMapper());
    }
}
