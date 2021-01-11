package fi.vaylavirasto.sillari.config;

import io.micrometer.core.instrument.MeterRegistry;
import io.micrometer.core.instrument.binder.MeterBinder;
import io.prometheus.client.CollectorRegistry;
import io.prometheus.client.exporter.MetricsServlet;
import io.prometheus.client.spring.web.EnablePrometheusTiming;
import org.springframework.boot.actuate.autoconfigure.metrics.MeterRegistryCustomizer;
import org.springframework.boot.web.servlet.ServletRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.context.Destroyed;
import javax.enterprise.context.Initialized;
import javax.enterprise.event.Observes;
import io.prometheus.client.hotspot.*;

@Configuration
@ApplicationScoped
@EnablePrometheusTiming
public class MetricsBean {
    public void init(@Observes @Initialized(ApplicationScoped.class) final Object init) throws Exception {
        DefaultExports.initialize();
    }

    public void destroy(@Observes @Destroyed(ApplicationScoped.class) final Object init) {
        CollectorRegistry.defaultRegistry.clear();
    }
    @Bean
    MeterRegistryCustomizer<MeterRegistry> metricsCommonTags() {
        return registry -> registry.config().commonTags("application", "sillari-backend");
    }
    @Bean
    public ServletRegistrationBean servletRegistrationBean() {
        return new ServletRegistrationBean(new MetricsServlet(), "/prometheus");
    }
}
