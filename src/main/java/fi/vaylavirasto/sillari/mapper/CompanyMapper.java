package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class CompanyMapper implements RecordMapper<Record, CompanyModel> {
    @Nullable
    @Override
    public CompanyModel map(Record record) {
        CompanyModel model = new CompanyModel();
        model.setId(record.get(TableAlias.company.ID));
        model.setName(record.get(TableAlias.company.NAME));
        model.setBusinessId(record.get(TableAlias.company.BUSINESS_ID));
        model.setRowCreatedTime(record.get(TableAlias.company.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.company.ROW_UPDATED_TIME));
        model.setPermits(new ArrayList<>());
        return model;
    }
}
