package fi.vaylavirasto.sillari.mapper;
import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.model.tables.OwnList;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class OwnListMapper implements RecordMapper<Record, OwnListModel> {

    @Nullable
    @Override
    public OwnListModel map(Record record) {
        OwnListModel model = new OwnListModel();
        model.setId(record.get(TableAlias.ownList.ID));
        model.setContractBusinessId(record.get(TableAlias.ownList.CONTRACT_BUSINESS_ID));
        model.setSupervisionId(record.get(TableAlias.ownList.SUPERVISION_ID));
        return model;
    }
}
