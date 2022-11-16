package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.OwnListMapper;
import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.impl.DSL;
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

    public Integer saveOwnlist(String businessId, String username, String listName, String list) {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> result = ctx.insertInto(TableAlias.ownList,
                    TableAlias.ownList.BUSINESSID,
                    TableAlias.ownList.USERNAME,
                    TableAlias.ownList.LISTNAME,
                    TableAlias.ownList.LIST
            ).values(
                    businessId,
                    username,
                    listName,
                    list
            )
                    .returningResult(TableAlias.company.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer id = result != null ? result.value1() : null;

            return id;

        });
    }



    public void updateOwnlist(String businessId, String username, String listName, String list) {

            dsl.transaction(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                ctx.update(TableAlias.ownList)
                        .set(TableAlias.ownList.LIST, list)
                        .where(TableAlias.ownList.USERNAME.eq(username))
                        .and(TableAlias.ownList.LISTNAME.eq(username))
                        .execute();
            });

    }
}
