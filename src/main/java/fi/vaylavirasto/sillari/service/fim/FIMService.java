package fi.vaylavirasto.sillari.service.fim;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import fi.vaylavirasto.sillari.api.rest.error.FIMRestException;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.service.fim.responseModel.FIMSupervisorMapper;
import fi.vaylavirasto.sillari.service.fim.responseModel.Group;
import fi.vaylavirasto.sillari.service.fim.responseModel.Groups;
import fi.vaylavirasto.sillari.service.fim.responseModel.Person;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Service
public class FIMService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.fim.url}")
    private String fimUrl;
    @Value("${sillari.fim.username}")
    private String username;
    @Value("${sillari.fim.password}")
    private String password;
    private final FIMSupervisorMapper mapper = Mappers.getMapper(FIMSupervisorMapper.class);
    private Future<List<SupervisorModel>> supervisors;
    private long supervisorsLastQueryedInMillis = 0;
    private static long CACHE_LIFE_IN_MILLIS = 60000;


    public List<SupervisorModel> getSupervisors() throws FIMRestException, ExecutionException, InterruptedException {
        if (!cachedDataCurrent()) {
            logger.trace("Get from FIM. Not using cached supervisornames");
            if (supervisors == null || supervisors.isDone()) {
                supervisorsLastQueryedInMillis = System.currentTimeMillis();
                ExecutorService executor = Executors.newWorkStealingPool();
                supervisors = executor.submit(() -> fetchSupervisors());
            }
        }
        return supervisors.get();
    }

    private List<SupervisorModel> fetchSupervisors() throws FIMRestException {
        Groups groups = getSupervisorsXML();
        Group group = groups.getGroup().get(0);

        List<SupervisorModel> supervisorsFromFIM = new ArrayList<>();
        for (Person persons : group.getPersons().getPerson()) {
            SupervisorModel supervisor = mapper.fromDTOToModel(persons);
            supervisorsFromFIM.add(supervisor);
        }
        return supervisorsFromFIM;
    }

    private boolean cachedDataCurrent() {
        return !(supervisors == null) && System.currentTimeMillis() - supervisorsLastQueryedInMillis < CACHE_LIFE_IN_MILLIS;
    }

    public Groups getSupervisorsXML() throws FIMRestException {
        logger.trace("Get supervisors from fimrest");
        WebClient webClient = buildClient();
        try {
            String xml = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .build())
                    .headers(h -> h.setBasicAuth(username, password))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            logger.trace("groups: " + xml);
            XmlMapper xmlMapper = new XmlMapper();

            Groups groups;

            groups = xmlMapper.readValue(xml, Groups.class);
            return groups;


        } catch (Exception e) {
            logger.error(e.getMessage());
            throw new FIMRestException(e.getMessage());
        }


    }

    private WebClient buildClient() {
        return WebClient.create(fimUrl);
    }


    public void populateSupervisorNamesFromFIM(List<SupervisorModel> supervisionSupervisors) {
        logger.trace("getting supervisors from FIMREST");
        boolean fimQuerySuccess = false;
        List<SupervisorModel> allSupervisors = new ArrayList<>();
        try {
            allSupervisors = getSupervisors();
            fimQuerySuccess = true;
        } catch (FIMRestException | ExecutionException | InterruptedException e) {
            logger.error("Error getting supervisors from FIMREST " + e.getMessage());
        }

        for (SupervisorModel selectedSupervisor : supervisionSupervisors) {
            try {
                SupervisorModel supervisorFromFIM = allSupervisors.stream().filter(s -> s.getUsername().equals(selectedSupervisor.getUsername())).findFirst().orElseThrow();
                selectedSupervisor.setFirstName(supervisorFromFIM.getFirstName());
                selectedSupervisor.setLastName(supervisorFromFIM.getLastName());
            } catch (NoSuchElementException nee) {
                if (fimQuerySuccess) {
                    logger.warn("Using supervisor username as name. Supervisor not found FIM data: " + selectedSupervisor.getUsername());
                } else {
                    logger.warn("Using supervisor username as name. Fetching from FIMREST failed.");
                }

                selectedSupervisor.setFirstName(selectedSupervisor.getUsername());
                selectedSupervisor.setLastName("");
            }

        }

    }
}
