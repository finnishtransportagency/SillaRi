package fi.vaylavirasto.sillari.model;
import com.google.common.collect.Lists;

import fi.vaylavirasto.sillari.model.tables.Address;
import fi.vaylavirasto.sillari.model.tables.Transport;
import fi.vaylavirasto.sillari.model.tables.Company;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class TransportMapper implements RecordMapper<Record, TransportModel> {
    // Table aliases
    public static final Transport transport = Tables.TRANSPORT.as("t");
    public static final Address arrivalAddress = Tables.ADDRESS.as("aa");
    public static final Address departureAddress = Tables.ADDRESS.as("da");
    public static final Company company = Tables.COMPANY.as("c");

    @Nullable
    @Override
    public TransportModel map(Record record) {
        CompanyModel c = new CompanyModel();
        c.setId(record.get(company.ID));
        c.setName(record.get(company.NAME));

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
        t.setBeginDate(record.get(transport.BEGINDATE));
        t.setEndDate(record.get(transport.ENDDATE));
        t.setArrivalAddress(aa);
        t.setDepartureAddress(da);
        t.setCompany(c);

        ArrayList<CrossingModel> crossingModelArrayList = new ArrayList();
        CrossingModel crossingModel = new CrossingModel();
        crossingModel.setId(0);
        BridgeModel bridgeModel = new BridgeModel();
        bridgeModel.setId(0L);
        bridgeModel.setName("Silta 1234 - Kankaanpää");
        crossingModel.setBridge(bridgeModel);
        crossingModelArrayList.add(crossingModel);

        t.setCrossings(crossingModelArrayList);

        return t;
    }
}
