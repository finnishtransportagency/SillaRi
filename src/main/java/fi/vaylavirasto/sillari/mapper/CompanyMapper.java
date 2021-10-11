package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.model.Tables;
import fi.vaylavirasto.sillari.model.tables.Company;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class CompanyMapper implements RecordMapper<Record, CompanyModel> {
    public static final Company company = Tables.COMPANY.as("co");

    @Nullable
    @Override
    public CompanyModel map(Record record) {
        CompanyModel companyModel = new CompanyModel();
        companyModel.setId(record.get(company.ID));
        companyModel.setName(record.get(company.NAME));
        companyModel.setBusinessId(record.get(company.BUSINESS_ID));
        companyModel.setPermits(new ArrayList<>());
        return companyModel;
    }
}
