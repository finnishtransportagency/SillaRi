package fi.vaylavirasto.sillari.config;

import lombok.extern.slf4j.Slf4j;
import org.jooq.DSLContext;
import org.jooq.ExecuteContext;
import org.jooq.conf.RenderQuotedNames;
import org.jooq.impl.DSL;
import org.jooq.impl.DefaultExecuteListener;

// NOTE: This is example code copied from https://www.jooq.org/doc/3.1/manual/sql-execution/execute-listeners/
@Slf4j
public class SQLDebugLogging extends DefaultExecuteListener {
    @Override
    public void executeStart(ExecuteContext context) {
        // Create a new DSLContext for logging rendering purposes
        // This DSLContext doesn't need a connection, only the SQLDialect...
        DSLContext create = DSL.using(context.dialect(), context.settings().withRenderQuotedNames(RenderQuotedNames.NEVER));

        // If we're executing a query
        if (context.query() != null) {
            log.debug(create.renderInlined(context.query()));
        }

        // If we're executing a routine
        else if (context.routine() != null) {
            log.debug(create.renderInlined(context.routine()));
        }
    }
}
