package fi.vaylavirasto.sillari;

import org.junit.jupiter.api.Test;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.util.Collections;


class LeluControllerTest {

    @Test
    void leluClient() {
        WebClient client = WebClient.builder()
                .baseUrl("http://localhost:8080/api/lelu")
                .defaultCookie("cookieKey", "cookieValue")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", "http://localhost:8080"))
                .build();

        String responseString = client.get()
                .uri("/testGet")
                .header("accept-version", "v1")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("HEllo:"+ responseString);


    }

}
