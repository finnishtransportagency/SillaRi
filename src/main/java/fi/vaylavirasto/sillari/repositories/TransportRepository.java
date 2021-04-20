package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.TransportMapper;
import fi.vaylavirasto.sillari.model.TransportModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public TransportModel getTransportById(int id) {
        return dsl.selectFrom(TransportMapper.transport)
                .where(TransportMapper.transport.ID.eq(id))
                .fetchOne(new TransportMapper());
    }

    public TransportModel getTransportByPermitIdAndRouteId(int permitId, int routeId) {
        return dsl.selectFrom(TransportMapper.transport)
                .where(TransportMapper.transport.PERMIT_ID.eq(permitId)
                    .and(TransportMapper.transport.ROUTE_ID.eq(routeId)))
                .fetchOne(new TransportMapper());
    }
}
