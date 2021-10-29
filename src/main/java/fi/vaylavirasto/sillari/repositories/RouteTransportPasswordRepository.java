package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportPasswordMapper;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;

@Repository
public class RouteTransportPasswordRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public RouteTransportPasswordModel findRouteTransportPassword(String transportPassword) {
        return dsl.selectFrom(TableAlias.routeTransportPassword)
                .where(TableAlias.routeTransportPassword.TRANSPORT_PASSWORD.eq(transportPassword))
                .orderBy(TableAlias.routeTransportPassword.VALID_FROM.desc())
                .fetchOne(new RouteTransportPasswordMapper());
    }
}
