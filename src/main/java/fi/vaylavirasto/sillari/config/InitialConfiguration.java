package fi.vaylavirasto.sillari.config;

import org.jooq.DSLContext;
import org.jooq.SQLDialect;
import org.jooq.conf.RenderQuotedNames;
import org.jooq.conf.Settings;
import org.jooq.impl.DSL;
import org.jooq.impl.DataSourceConnectionProvider;
import org.jooq.impl.DefaultConfiguration;
import org.jooq.impl.DefaultExecuteListenerProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.jdbc.datasource.TransactionAwareDataSourceProxy;

import javax.sql.DataSource;

@Configuration
public class InitialConfiguration {
    @Autowired
    private DataSource dataSource;

    @Autowired
    private Environment environment;

    @Bean
    public DataSourceConnectionProvider connectionProvider() {
        return new DataSourceConnectionProvider(new TransactionAwareDataSourceProxy(dataSource));
    }

    @Bean
    public DSLContext dsl() {
        return DSL.using(configuration());
    }

    public DefaultConfiguration configuration() {
        DefaultConfiguration jooqConfiguration = new DefaultConfiguration();

        jooqConfiguration.set(connectionProvider());
        jooqConfiguration.set(new DefaultExecuteListenerProvider(new ExceptionTranslator()));
        jooqConfiguration.set(new DefaultExecuteListenerProvider(new SQLDebugLogging()));

        // Get the jooq dialect from the application-<env>.yml file, should be POSTGRES (case sensitive)
        String sqlDialectName = environment.getRequiredProperty("spring.jooq.sql-dialect");
        SQLDialect dialect = SQLDialect.valueOf(sqlDialectName);
        jooqConfiguration.set(dialect);

        Settings settings = new Settings();
        settings.setRenderQuotedNames(RenderQuotedNames.NEVER);
        jooqConfiguration.setSettings(settings);

        return jooqConfiguration;
    }
}
