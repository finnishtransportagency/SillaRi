package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;
import java.util.Base64;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    private final boolean base64on;

    public PermitMapper() {
        this.base64on = false;
    }

    public PermitMapper(boolean base64on) {
        this.base64on = base64on;
    }

    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel model = new PermitModel();
        model.setId(record.get(TableAlias.permit.ID));
        model.setCompanyId(record.get(TableAlias.permit.COMPANY_ID));
        model.setPermitNumber(record.get(TableAlias.permit.PERMIT_NUMBER));
        model.setLeluVersion(record.get(TableAlias.permit.LELU_VERSION));
        model.setIsCurrentVersion(record.get(TableAlias.permit.IS_CURRENT_VERSION));
        model.setLeluLastModifiedDate(record.get(TableAlias.permit.LELU_LAST_MODIFIED_DATE));
        model.setValidStartDate(record.get(TableAlias.permit.VALID_START_DATE));
        model.setValidEndDate(record.get(TableAlias.permit.VALID_END_DATE));
        model.setTransportTotalMass(record.get(TableAlias.permit.TRANSPORT_TOTAL_MASS));
        model.setAdditionalDetails(record.get(TableAlias.permit.ADDITIONAL_DETAILS));
        String pdfObjectKey = record.get(TableAlias.permit.PDF_OBJECT_KEY);
        if (this.base64on && pdfObjectKey != null) {
            model.setPdfObjectKey(Base64.getEncoder().encodeToString(pdfObjectKey.getBytes()));
        } else {
            model.setPdfObjectKey(pdfObjectKey);
        }
        model.setRowCreatedTime(record.get(TableAlias.permit.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.permit.ROW_UPDATED_TIME));
        model.setRoutes(new ArrayList<>());
        model.setCustomerUsesSillari(record.get(TableAlias.permit.CUSTOMER_USES_SILLARI));
        return model;
    }
}
