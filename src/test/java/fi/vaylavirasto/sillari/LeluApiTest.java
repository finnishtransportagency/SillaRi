package fi.vaylavirasto.sillari;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.reactive.function.client.WebClientResponseException.BadRequest;
import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;


import java.util.Collections;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles({"local"})
class LeluApiTest {
    @Value("${sillari.lelu.version}")
    private String currentApiVersion;

    @Test
    public void testWithCorrectVersion() {
        WebClient client = buildClient();

        String responseString = client.get()
                .uri("/testGetWithVersion")
                .header("lelu-api-accept-version", currentApiVersion)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        assertEquals("api version match", responseString);
    }

    @Test
    public void testWithOldPatchVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newPatch = Integer.parseInt(versions[2]) - 1;
        String newVersion = String.join(".", versions[0], versions[1], Integer.toString(newPatch));

        if (newPatch >= 0) {
            WebClient client = buildClient();

            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", newVersion)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            assertEquals("api version match", responseString);
        }

    }

    @Test
    public void testWithOldMinorVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newMinor = Integer.parseInt(versions[1]) - 1;
        String newVersion = String.join(".", versions[0], Integer.toString(newMinor), versions[2]);

        if (newMinor >= 0) {
            WebClient client = buildClient();

            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", newVersion)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            assertEquals("api version match", responseString);
        }

    }

    @Test
    void testWithOldMajorVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newMajor = Integer.parseInt(versions[0]) - 1;
        String newVersion = String.join(".", Integer.toString(newMajor), versions[1], versions[2]);

        if (newMajor >= 0) {
            WebClient client = buildClient();

            assertThrows(BadRequest.class, () -> {
                String responseString = client.get()
                        .uri("/testGetWithVersion")
                        .header("lelu-api-accept-version", newVersion)
                        .retrieve()
                        .bodyToMono(String.class)
                        .block();
            });
        }

    }


    @Test
    void testWithTooNewPatchVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newPatch = Integer.parseInt(versions[2]) + 1;
        String newVersion = String.join(".", versions[0], versions[1], Integer.toString(newPatch));

        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", newVersion)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        });

    }

    @Test
    void testWithTooNewMinorVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newMinor = Integer.parseInt(versions[1]) + 1;
        String newVersion = String.join(".", versions[0], Integer.toString(newMinor), versions[2]);

        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", newVersion)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        });

    }

    @Test
    void testWithTooNewMajorVersion() {
        String[] versions = currentApiVersion.split("\\.");
        int newMajor = Integer.parseInt(versions[0]) + 1;
        String newVersion = String.join(".", Integer.toString(newMajor), versions[1], versions[2]);

        WebClient client = buildClient();

        assertThrows(BadRequest.class, () -> {
            String responseString = client.get()
                    .uri("/testGetWithVersion")
                    .header("lelu-api-accept-version", newVersion)
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
