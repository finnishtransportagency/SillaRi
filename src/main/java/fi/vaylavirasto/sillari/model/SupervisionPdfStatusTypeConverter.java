package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class SupervisionPdfStatusTypeConverter extends EnumConverter<String, SupervisionPdfStatusType> {
    public SupervisionPdfStatusTypeConverter(Class<String> fromType, Class<SupervisionPdfStatusType> toType) {
        super(fromType, toType);
    }
}
