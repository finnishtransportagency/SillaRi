package fi.vaylavirasto.sillari;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CommonsRequestLoggingFilter;
import org.springframework.web.filter.CorsFilter;

@Slf4j
@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
public class SillariApplication {
    public static void main(String[] args) {
        log.debug("application starting");
        log.info("db.url = " + System.getenv("db.url"));
        log.info("db.username = " + System.getenv("db.username"));
        System.out.println("db.url = " + System.getenv("db.url"));
        System.out.println("db.username = " + System.getenv("db.username"));
        System.out.println("db_url = " + System.getenv("db_url"));
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
        config.addAllowedOrigin("https://sillaridev.testivaylapilvi.fi");
        config.addAllowedOrigin("https://sillaritest.testivaylapilvi.fi");
        config.addAllowedOrigin("https://sillari.testivaylapilvi.fi");
        config.addAllowedOrigin("https://sillaripreprod.testivaylapilvi.fi");
        config.addAllowedOrigin("https://sillari.vaylapilvi.fi");
        config.addAllowedOrigin("https://vaylatest.auth.eu-west-1.amazoncognito.com");
        config.addAllowedOrigin("https://sillaritest.auth.eu-west-1.amazoncognito.com");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
        bean.setOrder(0);
        return bean;
    }
    // Validation messages
    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

        messageSource.setBasename("classpath:messages");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
    @Bean
    public LocalValidatorFactoryBean getValidator() {
        LocalValidatorFactoryBean bean = new LocalValidatorFactoryBean();
        bean.setValidationMessageSource(messageSource());
        return bean;
    }
}
