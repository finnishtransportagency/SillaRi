package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(TableAlias.permit.ID));
        permitModel.setCompanyId(record.get(TableAlias.permit.COMPANY_ID));
        permitModel.setPermitNumber(record.get(TableAlias.permit.PERMIT_NUMBER));
        permitModel.setLeluVersion(record.get(TableAlias.permit.LELU_VERSION));
        permitModel.setLeluLastModifiedDate(record.get(TableAlias.permit.LELU_LAST_MODIFIED_DATE));
        permitModel.setValidStartDate(record.get(TableAlias.permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(TableAlias.permit.VALID_END_DATE));
        permitModel.setTransportTotalMass(record.get(TableAlias.permit.TRANSPORT_TOTAL_MASS));
        permitModel.setAdditionalDetails(record.get(TableAlias.permit.ADDITIONAL_DETAILS));
        permitModel.setContractNumber(record.get(TableAlias.permit.CONTRACT_NUMBER));
        permitModel.setRoutes(new ArrayList<>());
        return permitModel;
    }
}
