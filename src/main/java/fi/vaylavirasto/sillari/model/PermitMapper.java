package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Permit;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;
import java.util.ArrayList;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    public static final Permit permit = Tables.PERMIT.as("p");

    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(permit.ID));
        permitModel.setCompanyId(record.get(permit.COMPANY_ID));
        permitModel.setPermitNumber(record.get(permit.PERMIT_NUMBER));
        permitModel.setValidStartDate(record.get(permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(permit.VALID_END_DATE));
        BigDecimal totalMass = record.get(permit.TOTAL_MASS);
        permitModel.setTotalMass(totalMass != null ? totalMass.doubleValue() : null);
        permitModel.setRoutes(new ArrayList<>());
        permitModel.setTransportsDimensionss(new ArrayList<>());
        permitModel.setAxleCharts(new ArrayList<>());
        return permitModel;
    }
}
