package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class SupervisorTypeConverter extends EnumConverter<String, SupervisorType> {
    public SupervisorTypeConverter(Class<String> fromType, Class<SupervisorType> toType) {
        super(fromType, toType);
    }
}
