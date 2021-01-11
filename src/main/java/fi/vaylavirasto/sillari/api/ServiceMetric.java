package fi.vaylavirasto.sillari.api;

import io.prometheus.client.Counter;
import io.prometheus.client.Histogram;
import io.prometheus.client.Summary;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.net.InetAddress;

public class ServiceMetric {
    private static final Logger logger = LogManager.getLogger(ServiceMetric.class);
    private static final String hostName = getHostName();
    private static final Histogram histogram = Histogram.build()
            .name("service_request_latency_histogram").help("Request latency in seconds (histogram).")
            .labelNames("host", "service", "operation")
            .register();
    private static final Summary summary = Summary.build()
            .quantile(0.50, 0.05) // mediaani / tolerance 5%
            .quantile(0.90, 0.01) // 90% / vaihtelu 1%
            .quantile(0.99, 0.01) // 99% / vaihtelu 1%
            .name("service_request_latency_summary").help("Request latency in seconds (summary).")
            .labelNames("host", "service", "operation")
            .register();
    private static final Counter counter = Counter.build()
            .name("service_request_count").help("Total requests counter.")
            .labelNames("host", "service", "operation")
            .register();
    private final String serviceName;
    private final String operation;
    private Histogram.Timer histogramTimer;
    private Summary.Timer summaryTimer;
    public ServiceMetric(String serviceName,String operation) {
        this.serviceName = serviceName;
        this.operation=operation;
        start();
    }
    public void start() {
        try {
            counter.labels(ServiceMetric.hostName,this.serviceName, operation).inc();
            summaryTimer = summary.labels(ServiceMetric.hostName,this.serviceName, operation).startTimer();
            histogramTimer = histogram.labels(ServiceMetric.hostName,this.serviceName, operation).startTimer();
        } catch(Exception e) {
            logger.error(e);
        }
    }
    public void end() {
        try {
            summaryTimer.observeDuration();
            histogramTimer.observeDuration();
        } catch(Exception e) {
            logger.error(e);
        }
    }
    public static String getHostName() {
        try {
            InetAddress ip = InetAddress.getLocalHost();
            return ip.getHostName();
        } catch(Exception e) {
            logger.error("getHostName failed",e);
        }
        return "na";
    }
}
