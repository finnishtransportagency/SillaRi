package fi.vaylavirasto.sillari.model;

import org.jooq.impl.EnumConverter;

public class ReportPdfStatusTypeConverter extends EnumConverter<String, ReportPdfStatusType> {
    public ReportPdfStatusTypeConverter(Class<String> fromType, Class<ReportPdfStatusType> toType) {
        super(fromType, toType);
    }
}
