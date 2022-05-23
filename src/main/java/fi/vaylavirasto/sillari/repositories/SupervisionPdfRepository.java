package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.SupervisionPdfMapper;
import fi.vaylavirasto.sillari.model.SupervisionPdfStatusType;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.model.SupervisionPdfModel;
import fi.vaylavirasto.sillari.util.ObjectKeyUtil;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.jooq.exception.DataAccessException;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;

@Repository
public class SupervisionPdfRepository {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    private DSLContext dsl;

    public SupervisionPdfModel getSupervisionPdf(Integer supervisionId) {
        return dsl.selectFrom(TableAlias.supervisionPdf)
                .where(TableAlias.supervisionPdf.SUPERVISION_ID.eq(supervisionId))
                .fetchOne(new SupervisionPdfMapper());
    }

    public Integer createSupervisionPdf(SupervisionPdfModel pdf) throws DataAccessException {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);

            Integer pdfId = ctx.nextval(Sequences.SUPERVISION_PDF_ID_SEQ).intValue();
            String objectIdentifier = ObjectKeyUtil.generateObjectIdentifier(ObjectKeyUtil.PDF_KTV_PREFIX, pdfId);
            String objectKey = ObjectKeyUtil.generateObjectKey(objectIdentifier, pdf.getSupervisionId());

            Record1<Integer> pdfIdResult = ctx.insertInto(TableAlias.supervisionPdf,
                            TableAlias.supervisionPdf.ID,
                            TableAlias.supervisionPdf.SUPERVISION_ID,
                            TableAlias.supervisionPdf.FILENAME,
                            TableAlias.supervisionPdf.OBJECT_KEY,
                            TableAlias.supervisionPdf.KTV_OBJECT_ID,
                            TableAlias.supervisionPdf.STATUS,
                            TableAlias.supervisionPdf.STATUS_TIME
                    ).values(
                            pdfId,
                            pdf.getSupervisionId(),
                            pdf.getFilename(),
                            objectKey,
                            objectIdentifier,
                            SupervisionPdfStatusType.IN_PROGRESS.toString(),
                            OffsetDateTime.now()
                    )
                    .returningResult(TableAlias.supervisionPdf.ID)
                    .fetchOne(); // Execute and return zero or one record

            return pdfIdResult != null ? pdfIdResult.value1() : null;
        });
    }

    public void updateSupervisionPdfStatus(SupervisionPdfModel pdf) {
        if (pdf.getStatus() != null) {
            dsl.transaction(configuration -> {
                DSLContext ctx = DSL.using(configuration);

                ctx.update(TableAlias.supervisionPdf)
                        .set(TableAlias.supervisionPdf.STATUS, pdf.getStatus().toString())
                        .set(TableAlias.supervisionPdf.STATUS_TIME, OffsetDateTime.now())
                        .where(TableAlias.supervisionPdf.ID.eq(pdf.getId()))
                        .execute();
            });
        }
    }

}
