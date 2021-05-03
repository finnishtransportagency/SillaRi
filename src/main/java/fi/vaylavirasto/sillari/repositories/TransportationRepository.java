package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.TransportationMapper;
import fi.vaylavirasto.sillari.model.TransportationModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class TransportationRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public TransportationModel getTransportationById(int id) {
        return dsl.selectFrom(TransportationMapper.transportation)
                .where(TransportationMapper.transportation.ID.eq(id))
                .fetchOne(new TransportationMapper());
    }

    public TransportationModel getTransportationByPermitIdAndRouteId(int permitId, int routeId) {
        TransportationModel a =  dsl.selectFrom(TransportationMapper.transportation)
                .where(TransportationMapper.transportation.PERMIT_ID.eq(permitId)
                    .and(TransportationMapper.transportation.ROUTE_ID.eq(routeId)))
                .fetchOne(new TransportationMapper());
        logger.info("Transportation: " + a);
        return a;
    }
}
