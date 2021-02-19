package fi.vaylavirasto.sillari.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.jooq.DSLContext;
import org.jooq.ExecuteContext;
import org.jooq.conf.RenderQuotedNames;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultExecuteListener;

// NOTE: This is example code copied from https://www.jooq.org/doc/3.1/manual/sql-execution/execute-listeners/
public class SQLDebugLogging extends DefaultExecuteListener {
    private static final Logger logger = LogManager.getLogger();

    @Override
    public void executeStart(ExecuteContext context) {
        // Create a new DSLContext for logging rendering purposes
        // This DSLContext doesn't need a connection, only the SQLDialect...
        DSLContext create = DSL.using(context.dialect(), context.settings().withRenderQuotedNames(RenderQuotedNames.NEVER));

        // If we're executing a query
        if (context.query() != null) {
            logger.debug(create.renderInlined(context.query()));
        }

        // If we're executing a routine
        else if (context.routine() != null) {
            logger.debug(create.renderInlined(context.routine()));
        }
    }
}
