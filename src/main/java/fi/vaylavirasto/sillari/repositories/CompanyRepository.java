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

import java.util.Locale;

import static org.jooq.impl.DSL.lower;

@Repository
public class CompanyRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

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

    public CompanyModel getCompanyByBusinessId(String businessId) {
        return dsl.select().from(TableAlias.company)
                .where(lower(TableAlias.company.BUSINESS_ID).eq(businessId.toLowerCase(Locale.ROOT)))
                .fetchOne(new CompanyMapper());
    }

    public CompanyModel getCompanyByRouteTransportId(Integer routeTransportId) {
        return dsl.select().from(TableAlias.company)
                .where(TableAlias.company.ID.eq(
                    dsl.select(TableAlias.permit.COMPANY_ID).from(TableAlias.permit).where(TableAlias.permit.ID.eq(
                        dsl.select(TableAlias.route.PERMIT_ID).from(TableAlias.route).where(TableAlias.route.ID.eq(
                            dsl.select(TableAlias.routeTransport.ROUTE_ID).from(TableAlias.routeTransport).where(TableAlias.routeTransport.ID.eq(
                                routeTransportId
                            ))
                        ))
                    ))
                ))
                .fetchOne(new CompanyMapper());
    }

    public CompanyModel getCompanyByPermitId(Integer permitId) {
        return dsl.select().from(TableAlias.company)
                .where(TableAlias.company.ID.eq(
                        dsl.select(TableAlias.permit.COMPANY_ID).from(TableAlias.permit).where(TableAlias.permit.ID.eq(
                              permitId
                        ))
                ))
                .fetchOne(new CompanyMapper());
    }

    public CompanyModel getCompanyByRouteBridgeId(Integer routeBridgeId) {
        return dsl.select().from(TableAlias.company)
                .where(TableAlias.company.ID.eq(
                        dsl.select(TableAlias.permit.COMPANY_ID).from(TableAlias.permit).where(TableAlias.permit.ID.eq(
                                dsl.select(TableAlias.route.PERMIT_ID).from(TableAlias.route).where(TableAlias.route.ID.eq(
                                        dsl.select(TableAlias.routeBridge.ROUTE_ID).from(TableAlias.routeBridge).where(TableAlias.routeBridge.ID.eq(
                                                routeBridgeId
                                        ))
                                ))
                        ))
                ))
                .fetchOne(new CompanyMapper());
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
