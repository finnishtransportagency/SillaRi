package fi.vaylavirasto.sillari.service.fim;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
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
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.ArrayList;
import java.util.List;

@Service
public class FIMService {
    private static final Logger logger = LogManager.getLogger();

    @Value("${sillari.fim.url}")
    private String fimUrl;
    private final FIMSupervisorMapper mapper = Mappers.getMapper(FIMSupervisorMapper.class);

    public List<SupervisorModel> getSupervisors() {
        List<SupervisorModel> supervisors = new ArrayList<>();
        try {
            Groups groups = getSupervisorsXML();
            Group group = groups.getGroup().get(0);
            for (Person persons : group.getPersons().getPerson()) {
                SupervisorModel supervisor = mapper.fromDTOToModel(persons);
                supervisors.add(supervisor);
            }

        } catch (TRexRestException e) {
            e.printStackTrace();
        }
        return supervisors;

    }

    public Groups getSupervisorsXML() throws TRexRestException {
        logger.debug("Get supervisors from fimrest");
        WebClient webClient = buildClient();
        try {
            Groups groups = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .build())
                    .retrieve()
                    .bodyToMono(Groups.class)
                    .block();
                logger.debug("groups: " + groups);
                return groups;
            } catch (WebClientResponseException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                throw new TRexRestException(e.getMessage(), e.getStatusCode());
            }


    }

    private WebClient buildClient() {
        return WebClient.create(fimUrl);
    }


}
