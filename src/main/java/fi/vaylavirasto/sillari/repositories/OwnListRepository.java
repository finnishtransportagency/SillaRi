package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.OwnListMapper;
import fi.vaylavirasto.sillari.mapper.SupervisionMapper;
import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OwnListRepository {
    @Autowired
    private DSLContext dsl;


    public List<SupervisionModel> getSupervisions(String contractBusinessId) {
        return dsl.select().from(TableAlias.ownList)
                .leftJoin(TableAlias.supervision).on(TableAlias.supervision.ID.eq(TableAlias.ownList.SUPERVISION_ID))
                .where(TableAlias.ownList.CONTRACT_BUSINESS_ID.eq(contractBusinessId))
                .orderBy(TableAlias.supervision.ROW_CREATED_TIME)
                .fetch(this::mapOwnListRecordWithSupervision);
    }

    private SupervisionModel mapOwnListRecordWithSupervision(Record record) {
        OwnListMapper ownListMapper = new OwnListMapper();
        OwnListModel ownListModel = ownListMapper.map(record);
        if (ownListModel != null) {
            SupervisionMapper supervisionMapper = new SupervisionMapper();
            ownListModel.setSupervision(supervisionMapper.map(record));
        }
        return ownListModel.getSupervision();
    }


    public void addToList(String contractBusinessId, SupervisionModel supervisionModel) {
    }
}
