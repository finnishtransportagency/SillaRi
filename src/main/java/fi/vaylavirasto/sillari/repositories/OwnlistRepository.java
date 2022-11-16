package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.OwnListMapper;
import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class OwnlistRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public OwnListModel getOwnlistById(Integer id) {
        return dsl.select().from(TableAlias.ownList)
                .where(TableAlias.ownList.ID.eq(id))
                .fetchOne(new OwnListMapper());
    }


    public OwnListModel getOwnlist(String username, String listname) {
        return dsl.select().from(TableAlias.ownList)
                .where(TableAlias.ownList.USERNAME.eq(username))
                .and(TableAlias.ownList.LISTNAME.eq(username))
                .fetchOne(new OwnListMapper());
    }
}
