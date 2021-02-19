package fi.vaylavirasto.sillari.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.ExecuteContext;
import org.jooq.SQLDialect;
import org.jooq.impl.DefaultExecuteListener;
import org.springframework.jdbc.support.SQLErrorCodeSQLExceptionTranslator;
import org.springframework.jdbc.support.SQLExceptionTranslator;

public class ExceptionTranslator extends DefaultExecuteListener {
    private static final Logger logger = LogManager.getLogger();

    @Override
    public void exception(ExecuteContext context) {
        SQLDialect dialect = context.dialect();

        SQLExceptionTranslator translator = (dialect.thirdParty().springDbName() != null)
                ? new SQLErrorCodeSQLExceptionTranslator(dialect.thirdParty().springDbName())
                : new SQLErrorCodeSQLExceptionTranslator();

        context.exception(translator.translate("Access database using jOOQ", context.sql(), context.sqlException()));
    }
}
