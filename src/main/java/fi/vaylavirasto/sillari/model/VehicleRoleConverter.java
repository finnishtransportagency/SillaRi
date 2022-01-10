package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class VehicleRoleConverter extends EnumConverter<String, VehicleRole> {
    public VehicleRoleConverter(Class<String> fromType, Class<VehicleRole> toType) {
        super(fromType, toType);
    }
}
