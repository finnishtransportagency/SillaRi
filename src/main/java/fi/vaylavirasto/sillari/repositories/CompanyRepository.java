package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.CompanyMapper;
import fi.vaylavirasto.sillari.model.CompanyModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Locale;

import static org.jooq.impl.DSL.lower;

@Repository
public class CompanyRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public List<CompanyModel> getCompaniesOfSupervisor(String username) {
        return dsl.select(TableAlias.company.ID, TableAlias.company.NAME, TableAlias.company.BUSINESS_ID)
                .from(TableAlias.company)
                .innerJoin(TableAlias.permit).on(TableAlias.company.ID.eq(TableAlias.permit.COMPANY_ID))
                .innerJoin(TableAlias.route).on(TableAlias.permit.ID.eq(TableAlias.route.PERMIT_ID))
                .innerJoin(TableAlias.routeTransport).on(TableAlias.route.ID.eq(TableAlias.routeTransport.ROUTE_ID))
                .innerJoin(TableAlias.supervision).on(TableAlias.routeTransport.ID.eq(TableAlias.supervision.ROUTE_TRANSPORT_ID))
                .innerJoin(TableAlias.supervisionSupervisor).on(TableAlias.supervision.ID.eq(TableAlias.supervisionSupervisor.SUPERVISION_ID))
                .where(TableAlias.supervisionSupervisor.USERNAME.eq(username))
                .groupBy(TableAlias.company.ID, TableAlias.company.NAME, TableAlias.company.BUSINESS_ID)
                .fetch(new CompanyMapper());
    }

    public CompanyModel getCompanyById(Integer id) {
        return dsl.select().from(TableAlias.company)
                .where(TableAlias.company.ID.eq(id))
                .fetchOne(new CompanyMapper());
    }

    public Integer getCompanyIdByBusinessId(String businessId) {
        Record1<Integer> record = dsl.select(TableAlias.company.ID).from(TableAlias.company)
                .where(lower(TableAlias.company.BUSINESS_ID).eq(businessId.toLowerCase(Locale.ROOT)))
                .fetchOne();
        return record != null ? record.value1() : null;
    }

    public Integer createCompany(CompanyModel companyModel) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Record1<Integer> companyIdResult = ctx.insertInto(TableAlias.company,
                    TableAlias.company.BUSINESS_ID,
                    TableAlias.company.NAME
            ).values(
                    companyModel.getBusinessId(),
                    companyModel.getName())
                    .returningResult(TableAlias.company.ID)
                    .fetchOne(); // Execute and return zero or one record

            Integer companyId = companyIdResult != null ? companyIdResult.value1() : null;
            companyModel.setId(companyId);
            return companyId;
        });
    }

}
