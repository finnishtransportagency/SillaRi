package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.TransportRegistrationMapper;
import fi.vaylavirasto.sillari.model.TransportRegistrationModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TransportRegistrationRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public TransportRegistrationModel getTransportRegistrationById(int id) {
        return dsl.selectFrom(TransportRegistrationMapper.transportRegistration)
                .where(TransportRegistrationMapper.transportRegistration.ID.eq(id))
                .fetchOne(new TransportRegistrationMapper());
    }

    public List<TransportRegistrationModel> getRegistrationsOfTransport(Integer transportId) {
        return dsl.select().from(TransportRegistrationMapper.transportRegistration)
                .where(TransportRegistrationMapper.transportRegistration.TRANSPORT_ID.eq(transportId))
                .fetch(new TransportRegistrationMapper());
    }
}
