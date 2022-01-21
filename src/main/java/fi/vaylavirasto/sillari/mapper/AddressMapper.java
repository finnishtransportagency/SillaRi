package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.AddressModel;
import fi.vaylavirasto.sillari.model.tables.Address;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AddressMapper implements RecordMapper<Record, AddressModel> {
    private final Address tableAlias;

    public AddressMapper(Address tableAlias) {
        this.tableAlias = tableAlias;
    }

    @Nullable
    @Override
    public AddressModel map(Record record) {
        AddressModel model = new AddressModel();
        model.setId(record.get(tableAlias.ID));
        model.setStreetAddress(record.get(tableAlias.STREETADDRESS));
        model.setRowCreatedTime(record.get(tableAlias.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(tableAlias.ROW_UPDATED_TIME));
        return model;
    }
}
