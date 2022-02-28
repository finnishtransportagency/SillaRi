package fi.vaylavirasto.sillari.service.fim;

import com.fasterxml.jackson.databind.MapperFeature;
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
    private List<SupervisorModel> supervisors = new ArrayList<>();
    private long supervisorsLastQueryedInMillis = 0;
    private static long CACHE_LIFE_IN_MILLIS = 60000;



    public List<SupervisorModel> getSupervisors() throws FIMRestException {
         if(!cachedDataCurrent()) {
             logger.debug("Get from FIM. Not using cached supervisornames");
             supervisorsLastQueryedInMillis = System.currentTimeMillis();
             supervisors = new ArrayList<>();

             Groups groups = getSupervisorsXML();
             Group group = groups.getGroup().get(0);

             for (Person persons : group.getPersons().getPerson()) {
                 SupervisorModel supervisor = mapper.fromDTOToModel(persons);
                 supervisors.add(supervisor);
             }
         }
         else{
             logger.debug("Using cached supervisornames");
         }
        return supervisors;
    }

    private boolean cachedDataCurrent() {
        return System.currentTimeMillis() - supervisorsLastQueryedInMillis < CACHE_LIFE_IN_MILLIS;
    }

    public Groups getSupervisorsXML() throws FIMRestException {
        logger.debug("Get supervisors from fimrest");
        WebClient webClient = buildClient();
        try {
            String xml = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .build())
                    .headers(h -> h.setBasicAuth(username, password))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            logger.debug("groups: " + xml);
            XmlMapper xmlMapper = new XmlMapper();
            xmlMapper.configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true);

            Groups groups = null;

            groups = xmlMapper.readValue(xml, Groups.class);
            logger.debug("hello: " + groups);
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
        logger.debug("getting supervisors from FIMREST");
        List<SupervisorModel> allSupervisors = new ArrayList<>();
        try {
            allSupervisors = getSupervisors();
        } catch (FIMRestException e) {
            logger.error("Error getting supervisors from FIMREST " + e.getMessage());
        }

        for (SupervisorModel selectedSupervisor : supervisionSupervisors) {
            try {
                SupervisorModel supervisorFromFIM = allSupervisors.stream().filter(s -> s.getUsername().equals(selectedSupervisor.getUsername())).findFirst().orElseThrow();
                selectedSupervisor.setFirstName(supervisorFromFIM.getFirstName());
                selectedSupervisor.setLastName(supervisorFromFIM.getLastName());
            } catch (NoSuchElementException nee) {
                logger.warn("Supervisor username not in FIM data");
                selectedSupervisor.setFirstName(selectedSupervisor.getUsername());
                selectedSupervisor.setLastName("");
            }

        }

    }
}
