package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.TransportMapper;
import fi.vaylavirasto.sillari.model.TransportModel;
import fi.vaylavirasto.sillari.model.tables.pojos.Transport;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransportRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<TransportModel> getAllTransports(Integer limit) {
        // return dsl.selectFrom(Tables.TRANSPORT).fetchInto(Transport.class);

        // Table aliases from TransportMapper are needed since Address is used in two different joins
        return dsl.select().from(TransportMapper.transport)
                .leftJoin(TransportMapper.arrivalAddress).on(TransportMapper.transport.ARRIVAL_ADDRESS_ID.eq(TransportMapper.arrivalAddress.ID))
                .leftJoin(TransportMapper.departureAddress).on(TransportMapper.transport.DEPARTURE_ADDRESS_ID.eq(TransportMapper.departureAddress.ID))
                .limit(limit)
                .fetch(new TransportMapper());
    }

    public Transport getTransportById(int id) {
        List<Transport> result = dsl.selectFrom(Tables.TRANSPORT).where(Tables.TRANSPORT.ID.eq(id)).fetchInto(Transport.class);
        return result.get(0);
    }
}
