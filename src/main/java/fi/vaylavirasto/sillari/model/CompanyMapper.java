package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Company;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class CompanyMapper implements RecordMapper<Record, CompanyModel> {
    public static final Company company = Tables.COMPANY.as("c");

    @Nullable
    @Override
    public CompanyModel map(Record record) {
        CompanyModel companyModel = new CompanyModel();
        companyModel.setId(record.get(company.ID));
        companyModel.setName(record.get(company.NAME));
        companyModel.setAuthorizations(new ArrayList<>());
        return companyModel;
    }
}
