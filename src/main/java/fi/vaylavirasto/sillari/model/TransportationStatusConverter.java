package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class TransportationStatusConverter extends EnumConverter<String, TransportationStatus> {
    public TransportationStatusConverter(Class<String> fromType, Class<TransportationStatus> toType) {
        super(fromType, toType);
    }
}
