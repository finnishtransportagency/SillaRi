package fi.vaylavirasto.sillari.service.fim;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import fi.vaylavirasto.sillari.api.rest.error.FIMRestException;
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
    @Value("${sillari.fim.username}")
    private String username;
    @Value("${sillari.fim.password}")
    private String password;
    private final FIMSupervisorMapper mapper = Mappers.getMapper(FIMSupervisorMapper.class);

    public List<SupervisorModel> getSupervisors() {
        List<SupervisorModel> supervisors = new ArrayList<>();
        try {
            Groups groups = getSupervisorsXML();
            Group group = groups.getGroup().get(0);
            int n=1;
            for (Person persons : group.getPersons().getPerson()) {
                SupervisorModel supervisor = mapper.fromDTOToModel(persons);
                supervisor.setId(n);
                n++;
                supervisors.add(supervisor);
            }

        } catch (FIMRestException e) {
            e.printStackTrace();
        }
        return supervisors;

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


}
