package fi.vaylavirasto.sillari;

import graphql.scalars.ExtendedScalars;
import graphql.schema.idl.RuntimeWiring;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.filter.CorsFilter;

@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
public class SillariApplication {
    private static final Logger logger = LogManager.getLogger();
    public static void main(String[] args) {
        logger.debug("application starting");
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.DateTime);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Date);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Time);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Object);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Json);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Locale);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.GraphQLBigDecimal);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.GraphQLBigInteger);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.GraphQLLong);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.GraphQLShort);
        RuntimeWiring.newRuntimeWiring().scalar(ExtendedScalars.Url);
        SpringApplication.run(SillariApplication.class, args);
    }
    @Bean
    public CommonsRequestLoggingFilter requestLoggingFilter() {
        CommonsRequestLoggingFilter loggingFilter = new CommonsRequestLoggingFilter();
        loggingFilter.setIncludeClientInfo(true);
        loggingFilter.setIncludeQueryString(true);
        loggingFilter.setIncludePayload(true);
        loggingFilter.setMaxPayloadLength(64000);
        return loggingFilter;
    }
    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://localhost:3001");
        config.addAllowedOrigin("https://sillaridev.testivaylapilvi.fi/");
        config.addAllowedOrigin("https://sillari.testivaylapilvi.fi/");
        config.addAllowedOrigin("https://sillari.vaylapilvi.fi/");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }
}
