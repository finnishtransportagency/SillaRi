package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.CompanyMapper;
import fi.vaylavirasto.sillari.model.CompanyModel;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CompanyRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<CompanyModel> getAllCompanies(Integer limit) {
        return dsl.select().from(CompanyMapper.company)
                .limit(limit)
                .fetch(new CompanyMapper());
    }

    public CompanyModel getCompanyById(Integer id) {
        return dsl.select().from(CompanyMapper.company)
                .where(CompanyMapper.company.ID.eq(id))
                .fetchOne(new CompanyMapper());
    }
}
