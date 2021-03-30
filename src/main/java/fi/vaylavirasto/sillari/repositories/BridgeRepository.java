package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.*;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class BridgeRepository {
    @Autowired
    private DSLContext dsl;
    public BridgeModel getBridge(Integer id) {
        BridgeModel model = dsl.select().from(BridgeMapper.bridge)
                .where(BridgeMapper.bridge.ID.eq(id))
                .fetchOne(new BridgeMapper());
        return model;
    }
}
