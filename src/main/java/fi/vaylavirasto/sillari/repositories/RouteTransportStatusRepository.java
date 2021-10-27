package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportStatusMapper;
import fi.vaylavirasto.sillari.model.RouteTransportStatusModel;
import fi.vaylavirasto.sillari.model.TransportStatusType;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class RouteTransportStatusRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<RouteTransportStatusModel> getTransportStatusHistory(Integer routeTransportId) {
        return dsl.selectFrom(TableAlias.transportStatus)
                .where(TableAlias.transportStatus.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .orderBy(TableAlias.transportStatus.TIME.desc())
                .fetch(new RouteTransportStatusMapper());
    }

    public void insertTransportStatus(DSLContext ctx, Integer routeTransportId, TransportStatusType statusType) {
        ctx.insertInto(TableAlias.transportStatus,
                        TableAlias.transportStatus.ROUTE_TRANSPORT_ID,
                        TableAlias.transportStatus.STATUS,
                        TableAlias.transportStatus.TIME
                ).values(
                        routeTransportId,
                        String.valueOf(statusType),
                        OffsetDateTime.now())
                .execute();
    }

    public void deleteSupervisionStatuses(DSLContext ctx, Integer routeTransportId) {
        ctx.deleteFrom(TableAlias.transportStatus)
                .where(TableAlias.transportStatus.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .execute();
    }
}
