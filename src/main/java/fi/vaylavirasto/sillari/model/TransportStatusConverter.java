package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class TransportStatusConverter extends EnumConverter<String, TransportStatus> {
    public TransportStatusConverter(Class<String> fromType, Class<TransportStatus> toType) {
        super(fromType, toType);
    }
}
