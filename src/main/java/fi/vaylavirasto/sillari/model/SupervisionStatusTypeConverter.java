package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class SupervisionStatusTypeConverter extends EnumConverter<String, SupervisionStatusType> {
    public SupervisionStatusTypeConverter(Class<String> fromType, Class<SupervisionStatusType> toType) {
        super(fromType, toType);
    }
}
