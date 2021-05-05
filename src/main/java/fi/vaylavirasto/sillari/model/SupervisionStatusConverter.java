package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class SupervisionStatusConverter extends EnumConverter<String, SupervisionStatus> {
    public SupervisionStatusConverter(Class<String> fromType, Class<SupervisionStatus> toType) {
        super(fromType, toType);
    }
}
