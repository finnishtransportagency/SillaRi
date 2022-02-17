package fi.vaylavirasto.sillari.service.fim;

import fi.vaylavirasto.sillari.api.rest.error.TRexRestException;
import fi.vaylavirasto.sillari.model.SupervisorModel;
import fi.vaylavirasto.sillari.service.fim.responseModel.FIMSupervisorMapper;
import fi.vaylavirasto.sillari.service.fim.responseModel.GroupType;
import fi.vaylavirasto.sillari.service.fim.responseModel.GroupsType;
import fi.vaylavirasto.sillari.service.fim.responseModel.PersonType;
import fi.vaylavirasto.sillari.service.trex.bridgeInfoInterface.TrexBridgeInfoResponseJson;
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



/*    Muutetaan tämä hakemaan valvojat käyttövaltuushallinnasta REST4FIM:iä käyttäen. Rajapintakuvaus liitteenä. Haetaan kaikki käyttäjät jolle on määritelty rooli "sillari_sillanvalvoja".

    Testipuolen REST-esimerkki:

    https://testioag.vayla.fi/FIMGET/SimpleREST4FIM/1/Person.svc/?fetch=ObjectID,FirstName,LastName,AccountName,Email,MiddleName,JobTitle,Toimiala,Department,Yksikko,OfficeLocation&filterproperty=AccountType&filter=L-tunnus*/

/*
    en sillon aikanaan saanu noita sillariryhmiä toimimaan mutta raidemaintenance jota me käytetään raiteessa toimi tälleen :



    sh-4.2$ curl --user svc_sillari "https://testioag.vayla.fi/FIMGET/SimpleREST4FIM/1/group.svc/byfilter?filterproperty=DisplayName&filter=sillari_sillanvalvoja&fetch=ObjectID,DisplayName"
<groups><group><ObjectID>fdfdfe1d-ef7d-4f65-84c5-2afab9ae311f</ObjectID><DisplayName>sillari_sillanvalvoja</DisplayName></group></groups>



    ja tolla objectid:llä ku kysyi

    sh-4.2$ curl --user svc_sillari "https://testioag.vayla.fi/FIMGET/SimpleREST4FIM/1/group.svc/fdfdfe1d-ef7d-4f65-84c5-2afab9ae311f"
    josta tuli sit vastauksena

<groups><group><ObjectID>fdfdfe1d-ef7d-4f65-84c5-2afab9ae311f</ObjectID><DisplayName>raidemaintenance</DisplayName><members><member><DisplayName>Brown Anthony</DisplayName><Description/><Value>9280bce0-66e4-4b8e-8f29-0eae24282264</Value><DomainAndUserNameValue>9280bce0-66e4-4b8e-8f29-0eae24282264</DomainAndUserNameValue></member><member> ...*/

    public List<SupervisorModel> getSupervisors() {
        List<SupervisorModel> supervisors = new ArrayList<>();
        try {
            GroupsType groups = getSupervisorsXML();
            GroupType group = groups.getGroup();
            for (PersonType persons : group.getPersons().getPerson()) {
                SupervisorModel supervisor = mapper.fromDTOToModel(persons);
            }

        } catch (TRexRestException e) {
            e.printStackTrace();
        }


    }

    public GroupsType getSupervisorsXML() throws TRexRestException {

        logger.trace("bridgeOid: " + bridgeOid);

        if (bridgeOid != null) {
            WebClient webClient = buildClient();
            try {
                TrexBridgeInfoResponseJson bridgeInfo = webClient.get()
                        .uri(uriBuilder -> uriBuilder

                                .queryParam("oid", bridgeOid)
                                .build())
                        .retrieve()
                        .bodyToMono(TrexBridgeInfoResponseJson.class)
                        .block();
                logger.debug("bridgeInfo: " + bridgeInfo);
                return bridgeInfo;
            } catch (WebClientResponseException e) {
                logger.error(e.getMessage() + e.getStatusCode());
                throw new TRexRestException(e.getMessage(), e.getStatusCode());
            }

        } else {
            return null;
        }
    }

    private WebClient buildClient() {
        return WebClient.create(fimUrl);
    }


}
