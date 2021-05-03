package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Transportation;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class TransportationMapper implements RecordMapper<Record, TransportationModel> {
    public static final Transportation transportation = Tables.TRANSPORTATION.as("t");

    @Nullable
    @Override
    public TransportationModel map(Record record) {
        TransportationModel transportationModel = new TransportationModel();
        transportationModel.setId(record.get(transportation.ID));
        transportationModel.setPermitId(record.get(transportation.PERMIT_ID));
        transportationModel.setRouteId(record.get(transportation.ROUTE_ID));
        transportationModel.setDepartureTime(record.get(transportation.DEPARTURE_TIME));
        transportationModel.setArrivalTime(record.get(transportation.ARRIVAL_TIME));
        transportationModel.setStatus(record.get(transportation.STATUS, new TransportationStatusConverter(String.class, TransportationStatus.class)));
        transportationModel.setCurrentLocation(record.get(transportation.CURRENT_LOCATION));
        transportationModel.setCurrentLocationUpdated(record.get(transportation.CURRENT_LOCATION_UPDATED));
        return transportationModel;
    }
}
