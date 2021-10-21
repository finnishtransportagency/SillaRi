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
        AddressModel addressModel = new AddressModel();
        addressModel.setId(record.get(tableAlias.ID));
        addressModel.setStreetAddress(record.get(tableAlias.STREETADDRESS));
        return addressModel;
    }
}
