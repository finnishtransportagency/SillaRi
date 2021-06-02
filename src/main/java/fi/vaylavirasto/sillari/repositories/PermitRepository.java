package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.model.PermitMapper;
import fi.vaylavirasto.sillari.model.PermitModel;
import fi.vaylavirasto.sillari.model.Sequences;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class PermitRepository {
    private static final Logger logger = LogManager.getLogger();
    @Autowired
    private DSLContext dsl;

    public List<PermitModel> getCompanysPermits(Integer companyId) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.COMPANY_ID.eq(companyId))
                .fetch(new PermitMapper());
    }

    public PermitModel getPermit(Integer id) {
        return dsl.select().from(PermitMapper.permit)
                .leftJoin(PermitMapper.axleChart)
                .on(PermitMapper.permit.ID.eq(PermitMapper.axleChart.PERMIT_ID))
                .leftJoin(PermitMapper.transportDimensions)
                .on(PermitMapper.permit.ID.eq(PermitMapper.transportDimensions.PERMIT_ID))
                .where(PermitMapper.permit.ID.eq(id))
                .fetchOne(new PermitMapper());
    }

    public Integer getPermitIdByPermitNumber(String permitNumber) {
        Record1<Integer> record = dsl.select(PermitMapper.permit.ID).from(PermitMapper.permit)
                .where(PermitMapper.permit.PERMIT_NUMBER.eq(permitNumber))
                .fetchOne();
        return record != null ? record.value1() : null;
    }

    public Integer createPermit(PermitModel permitModel) {
        Integer[] id = new Integer[1];

        dsl.transaction(configuration -> {
            id[0] = dsl.nextval(Sequences.AUTHORIZATION_ID_SEQ).intValue();

            configuration.dsl().insertInto(PermitMapper.permit,
                    PermitMapper.permit.ID,
                    PermitMapper.permit.COMPANY_ID,
                    PermitMapper.permit.PERMIT_NUMBER,
                    PermitMapper.permit.LELU_VERSION,
                    PermitMapper.permit.LELU_LAST_MODIFIED_DATE,
                    PermitMapper.permit.VALID_START_DATE,
                    PermitMapper.permit.VALID_END_DATE,
                    PermitMapper.permit.TRANSPORT_TOTAL_MASS,
                    PermitMapper.permit.ADDITIONAL_DETAILS
            )
                    .values(id[0],
                            1, // FIXME!
                            permitModel.getPermitNumber(),
                            permitModel.getLeluVersion(),
                            permitModel.getLeluLastModifiedDate(),
                            permitModel.getValidStartDate(),
                            permitModel.getValidEndDate(),
                            permitModel.getTransportTotalMass(),
                            permitModel.getAdditionalDetails())
                    .execute();
        });

        return id[0];
    }

    public Integer updatePermit(PermitModel permitModel) {
        dsl.update(PermitMapper.permit)
                .set(PermitMapper.permit.PERMIT_NUMBER, permitModel.getPermitNumber())
                .set(PermitMapper.permit.LELU_VERSION, permitModel.getLeluVersion())
                .set(PermitMapper.permit.LELU_LAST_MODIFIED_DATE, permitModel.getLeluLastModifiedDate())
                .set(PermitMapper.permit.VALID_START_DATE, permitModel.getValidStartDate())
                .set(PermitMapper.permit.VALID_END_DATE, permitModel.getValidEndDate())
                .set(PermitMapper.permit.TRANSPORT_TOTAL_MASS, permitModel.getTransportTotalMass())
                .set(PermitMapper.permit.ADDITIONAL_DETAILS, permitModel.getAdditionalDetails())
                .where(PermitMapper.permit.ID.eq(permitModel.getId()))
                .execute();
        return permitModel.getId();
    }

}
