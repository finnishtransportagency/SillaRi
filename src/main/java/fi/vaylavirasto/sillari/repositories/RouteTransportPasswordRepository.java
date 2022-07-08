package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.RouteTransportPasswordMapper;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import fi.vaylavirasto.sillari.util.TransportPasswordUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

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


    public RouteTransportPasswordModel getTransportPassword(Integer routeTransportId) {
        return dsl.selectFrom(TableAlias.routeTransportPassword)
                .where(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .orderBy(TableAlias.routeTransportPassword.VALID_FROM.desc())
                .fetchOne(new RouteTransportPasswordMapper());
    }

    public void insertTransportPassword(DSLContext ctx, Integer routeTransportId, String password, OffsetDateTime expiryDate) {
        ctx.insertInto(TableAlias.routeTransportPassword,
                        TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID,
                        TableAlias.routeTransportPassword.TRANSPORT_PASSWORD,
                        TableAlias.routeTransportPassword.VALID_FROM,
                        TableAlias.routeTransportPassword.VALID_TO
                ).values(
                        routeTransportId,
                        password,
                        OffsetDateTime.now(),
                        expiryDate)
                .execute();
    }

    public void updateTransportPassword(Integer routeTransportId, String password) {
        dsl.transaction(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            ctx.update(TableAlias.routeTransportPassword)
                    .set(TableAlias.routeTransportPassword.TRANSPORT_PASSWORD, password)
                    .where(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                    .execute();
        });
    }

    public void updateTransportPasswordExpiry(DSLContext ctx, Integer routeTransportId, OffsetDateTime expiryDate) {
        ctx.update(TableAlias.routeTransportPassword)
                .set(TableAlias.routeTransportPassword.VALID_FROM, OffsetDateTime.now())
                .set(TableAlias.routeTransportPassword.VALID_TO, expiryDate)
                .where(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .execute();
    }

    public void deleteTransportPasswords(DSLContext ctx, Integer routeTransportId) {
        ctx.deleteFrom(TableAlias.routeTransportPassword)
                .where(TableAlias.routeTransportPassword.ROUTE_TRANSPORT_ID.eq(routeTransportId))
                .execute();
    }

    public String generateUniqueTransportPassword() {
        // Generate a transport password and make sure it is unique in the database
        // A for loop is used instead of a while loop just as a precaution against a possible infinite loop
        String password = "";
        RouteTransportPasswordModel existingPassword = null;

        for (int i = 0; i < 100; i++) {
            password = TransportPasswordUtil.generate();
            existingPassword = findRouteTransportPassword(password);

            if (existingPassword == null) {
                break;
            }
        }

        return password;
    }
}
