package fi.vaylavirasto.sillari.service.fim;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import fi.vaylavirasto.sillari.api.rest.error.FIMRestException;
import fi.vaylavirasto.sillari.auth.SillariUser;
import fi.vaylavirasto.sillari.service.fim.responseModel.FIMUserMapper;
import fi.vaylavirasto.sillari.service.fim.responseModel.Group;
import fi.vaylavirasto.sillari.service.fim.responseModel.Groups;
import fi.vaylavirasto.sillari.service.fim.responseModel.Person;
import lombok.extern.slf4j.Slf4j;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.util.UriBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

@Slf4j
@Service
public class FIMService {
    @Value("${sillari.fim.url}")
    private String fimUrl;
    @Value("${sillari.fim.username}")
    private String username;
    @Value("${sillari.fim.password}")
    private String password;
    private final FIMUserMapper mapper = Mappers.getMapper(FIMUserMapper.class);
    private Future<List<SillariUser>> supervisorUsers;
    private long supervisorsLastQueryedInMillis = 0;
    private static long CACHE_LIFE_IN_MILLIS = 60000;


    public List<SillariUser> getSupervisorUsers() throws FIMRestException, ExecutionException, InterruptedException {
        if (!cachedDataCurrent()) {
            log.trace("Get from FIM. Not using cached supervisor users");
            if (supervisorUsers == null || supervisorUsers.isDone()) {
                supervisorsLastQueryedInMillis = System.currentTimeMillis();
                ExecutorService executor = Executors.newWorkStealingPool();
                supervisorUsers = executor.submit(this::fetchSupervisorUsers);
            }
        }
        return supervisorUsers.get();
    }

    private List<SillariUser> fetchSupervisorUsers() throws FIMRestException {
        Groups groups = getSupervisorUsersXML();
        Group group = groups.getGroup().get(0);

        List<SillariUser> supervisorsFromFIM = new ArrayList<>();
        for (Person persons : group.getPersons().getPerson()) {
            SillariUser supervisor = mapper.fromDTOToModel(persons);
            supervisorsFromFIM.add(supervisor);
        }
        return supervisorsFromFIM;
    }

    private boolean cachedDataCurrent() {
        return !(supervisorUsers == null) && System.currentTimeMillis() - supervisorsLastQueryedInMillis < CACHE_LIFE_IN_MILLIS;
    }

    public Groups getSupervisorUsersXML() throws FIMRestException {
        log.trace("Get sillari supervisor users from fimrest");
        WebClient webClient = buildClient();
        try {
            String xml = webClient.get()
                    .uri(UriBuilder::build)
                    .headers(h -> h.setBasicAuth(username, password))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
            log.trace("groups: " + xml);
            XmlMapper xmlMapper = new XmlMapper();

            Groups groups;

            groups = xmlMapper.readValue(xml, Groups.class);
            return groups;

        } catch (Exception e) {
            log.error(e.getMessage());
            throw new FIMRestException(e.getMessage());
        }
    }

    private WebClient buildClient() {
        return WebClient.create(fimUrl);
    }

}
