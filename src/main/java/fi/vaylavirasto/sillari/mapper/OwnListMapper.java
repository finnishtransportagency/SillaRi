package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.OwnListModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class OwnListMapper  implements RecordMapper<Record, OwnListModel> {
    @Nullable
    @Override
    public OwnListModel map(Record record) {
        OwnListModel model = new OwnListModel();
        model.setId(record.get(TableAlias.ownList.ID));
        model.setUsername(record.get(TableAlias.ownList.USERNAME));
        model.setBusinessId(record.get(TableAlias.ownList.BUSINESSID));
        model.setListname(record.get(TableAlias.ownList.LISTNAME));
        model.setList(record.get(TableAlias.ownList.LIST));
        return model;
    }
}

