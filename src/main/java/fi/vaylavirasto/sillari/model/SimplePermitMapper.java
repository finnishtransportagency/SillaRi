package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Permit;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class SimplePermitMapper implements RecordMapper<Record, PermitModel> {
    public static final Permit permit = Tables.PERMIT.as("pe");

    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(permit.ID));
        permitModel.setCompanyId(record.get(permit.COMPANY_ID));
        permitModel.setPermitNumber(record.get(permit.PERMIT_NUMBER));
        permitModel.setLeluVersion(record.get(permit.LELU_VERSION));
        permitModel.setLeluLastModifiedDate(record.get(permit.LELU_LAST_MODIFIED_DATE));
        permitModel.setValidStartDate(record.get(permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(permit.VALID_END_DATE));
        permitModel.setTransportTotalMass(record.get(permit.TRANSPORT_TOTAL_MASS));
        permitModel.setAdditionalDetails(record.get(permit.ADDITIONAL_DETAILS));
        return permitModel;
    }
}
