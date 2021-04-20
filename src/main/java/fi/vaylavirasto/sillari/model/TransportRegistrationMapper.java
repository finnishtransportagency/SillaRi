package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.TransportRegistration;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class TransportRegistrationMapper implements RecordMapper<Record, TransportRegistrationModel> {
    public static final TransportRegistration transportRegistration = Tables.TRANSPORT_REGISTRATION.as("tr");

    @Nullable
    @Override
    public TransportRegistrationModel map(Record record) {
        TransportRegistrationModel transportRegistrationModel = new TransportRegistrationModel();
        transportRegistrationModel.setId(record.get(transportRegistration.ID));
        transportRegistrationModel.setTransportId(record.get(transportRegistration.TRANSPORT_ID));
        transportRegistrationModel.setRegistrationNumber(record.get(transportRegistration.REGISTRATION_NUMBER));
        return transportRegistrationModel;
    }
}
