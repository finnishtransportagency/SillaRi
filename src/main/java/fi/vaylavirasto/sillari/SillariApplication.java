package fi.vaylavirasto.sillari;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableCaching
public class SillariApplication {
    private static final Logger logger = LogManager.getLogger();
    public static void main(String[] args) {
        logger.debug("application starting");
        SpringApplication.run(SillariApplication.class, args);
    }
}
