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
        CompanyModel companyModel = new CompanyModel();
        companyModel.setId(record.get(TableAlias.company.ID));
        companyModel.setName(record.get(TableAlias.company.NAME));
        companyModel.setBusinessId(record.get(TableAlias.company.BUSINESS_ID));
        companyModel.setPermits(new ArrayList<>());
        return companyModel;
    }
}
