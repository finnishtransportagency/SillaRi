package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Address;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AddressMapper implements RecordMapper<Record, AddressModel> {
    public static final Address address = Tables.ADDRESS.as("ad");

    @Nullable
    @Override
    public AddressModel map(Record record) {
        AddressModel model = new AddressModel();
        model.setId(record.get(address.ID));
        model.setStreetaddress(record.get(address.STREETADDRESS));
        model.setPostalcode(record.get(address.POSTALCODE));
        model.setCity(record.get(address.CITY));
        return model;
    }
}
