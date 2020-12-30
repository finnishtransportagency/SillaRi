package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.pojos.Address;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static org.jooq.impl.DSL.condition;

@Repository
public class AddressRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public Address getAddressById(Integer id) {

        List<Address> addresses = dsl.selectFrom(Tables.ADDRESS).where(Tables.ADDRESS.ID.eq(id)).fetchInto(Address.class);
        if(addresses != null && addresses.size() == 1)
            return addresses.get(0);
        return null;
    }
}
