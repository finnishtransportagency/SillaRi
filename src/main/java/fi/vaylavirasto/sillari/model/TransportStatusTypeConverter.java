package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class TransportStatusTypeConverter extends EnumConverter<String, TransportStatusType> {
    public TransportStatusTypeConverter(Class<String> fromType, Class<TransportStatusType> toType) {
        super(fromType, toType);
    }
}
