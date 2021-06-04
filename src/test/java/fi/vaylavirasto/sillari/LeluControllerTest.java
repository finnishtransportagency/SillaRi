package fi.vaylavirasto.sillari;

import org.junit.jupiter.api.Test;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.util.Collections;


class LeluControllerTest {

    @Test
    void testWithCorrectVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .header("accept-version", "0.1.0")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("HEllo:"+ responseString);


    }

    @Test
    void testWithOldVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .header("accept-version", "0.0.0")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("HEllo:"+ responseString);


    }

    @Test
    void testWithNoVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("HEllo:"+ responseString);


    }

    private WebClient buildClient(){
        return WebClient.builder()
                .baseUrl("http://localhost:8080/api/lelu")
                .defaultCookie("cookieKey", "cookieValue")
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultUriVariables(Collections.singletonMap("url", "http://localhost:8080"))
                .build();
    }

}
