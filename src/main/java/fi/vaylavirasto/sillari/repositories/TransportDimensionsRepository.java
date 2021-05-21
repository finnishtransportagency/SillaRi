package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.TransportDimensionsMapper;
import fi.vaylavirasto.sillari.model.TransportDimensionsModel;
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

    public TransportDimensionsModel getTransportById(int id) {
        return dsl.selectFrom(TransportDimensionsMapper.transport)
                .where(TransportDimensionsMapper.transport.ID.eq(id))
                .fetchOne(new TransportDimensionsMapper());
    }

    public TransportDimensionsModel getTransportByPermitIdAndRouteId(int permitId, int routeId) {
        return dsl.selectFrom(TransportDimensionsMapper.permit)
                .where(TransportDimensionsMapper.transport.PERMIT_ID.eq(permitId)
                    .and(TransportDimensionsMapper.transport.ROUTE_ID.eq(routeId)))
                .fetchOne(new TransportDimensionsMapper());
    }
}
