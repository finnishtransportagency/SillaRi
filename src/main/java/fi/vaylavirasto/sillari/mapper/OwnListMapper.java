package fi.vaylavirasto.sillari.mapper;
import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.model.tables.OwnList;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class OwnListMapper implements RecordMapper<Record, OwnListModel> {
    private final OwnList tableAlias;

    public OwnListMapper(OwnList tableAlias) {
        this.tableAlias = tableAlias;
    }

    @Nullable
    @Override
    public OwnListModel map(Record record) {
        OwnListModel model = new OwnListModel();
        model.setId(record.get(tableAlias.ID));
        model.setContractBusinessId(record.get(tableAlias.CONTRACT_BUSINESS_ID));
        model.setSupervisionId(record.get(tableAlias.SUPERVISION_ID));
        return model;
    }
}
