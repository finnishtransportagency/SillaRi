package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Address;
import fi.vaylavirasto.sillari.model.tables.Transport;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class TransportMapper implements RecordMapper<Record, TransportModel> {
    // Table aliases
    public static final Transport transport = Tables.TRANSPORT.as("t");
    public static final Address arrivalAddress = Tables.ADDRESS.as("aa");
    public static final Address departureAddress = Tables.ADDRESS.as("da");

    @Nullable
    @Override
    public TransportModel map(Record record) {
        AddressModel aa = new AddressModel();
        aa.setId(record.get(arrivalAddress.ID));
        aa.setStreet(record.get(arrivalAddress.STREET));
        aa.setPostalcode(record.get(arrivalAddress.POSTALCODE));
        aa.setCity(record.get(arrivalAddress.CITY));

        AddressModel da = new AddressModel();
        da.setId(record.get(departureAddress.ID));
        da.setStreet(record.get(departureAddress.STREET));
        da.setPostalcode(record.get(departureAddress.POSTALCODE));
        da.setCity(record.get(departureAddress.CITY));

        TransportModel t = new TransportModel();
        t.setId(record.get(transport.ID));
        t.setTitle(record.get(transport.TITLE));
        t.setArrivalAddress(aa);
        t.setDepartureAddress(da);

        return t;
    }
}
