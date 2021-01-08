package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.pojos.Transport;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class TransportRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<Transport> getAllTransports() {
        return dsl.selectFrom(Tables.TRANSPORT).fetchInto(Transport.class);
    }
    public Transport getTransportById(int id) {
        List<Transport> result = dsl.selectFrom(Tables.TRANSPORT).where(Tables.TRANSPORT.ID.eq(id)).fetchInto(Transport.class);
        return result.get(0);
    }
}
