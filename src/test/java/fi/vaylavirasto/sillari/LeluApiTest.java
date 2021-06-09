package fi.vaylavirasto.sillari;

import org.springframework.web.reactive.function.client.WebClientResponseException.BadRequest;
import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.util.Collections;


class LeluApiTest {

    @Test
    public void testWithCorrectVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .header("lelu-api-accept-version", "1.1.1")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        assertEquals("api version match", responseString);
    }

    @Test
    public void testWithOlderSameMajorVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .header("lelu-api-accept-version", "1.0.0")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        assertEquals("api version match", responseString);


    }

    @Test
    void testWithOldMajorVersion() {
        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", "0.9.9")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        });

    }


    @Test
    void testWithTooNewPatchVersion() {
        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", "1.1.2")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        });

    }

    @Test
    void testWithTooNewMinorVersion() {
        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", "1.2.1")
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        });

    }


    @Test
    void testWithNoVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .retrieve()
                .bodyToMono(String.class)
                .block();

        assertEquals("api version missing", responseString);


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
