package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.AddressMapper;
import fi.vaylavirasto.sillari.model.AddressModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class AddressRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public AddressModel getAddressById(Integer id) {
        return dsl.selectFrom(AddressMapper.address)
                .where(AddressMapper.address.ID.eq(id))
                .fetchOne(new AddressMapper());
    }
}
