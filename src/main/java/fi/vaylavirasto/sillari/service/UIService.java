package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.auth.SillariUser;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class UIService {
    private static final Logger logger = LogManager.getLogger();

    private static String getEncodedKeyValue(Map.Entry<String, String> p) {
        try {
            return String.format("%s=%s", URLEncoder.encode(p.getKey(), StandardCharsets.UTF_8.toString()), URLEncoder.encode(p.getValue(), StandardCharsets.UTF_8.toString()));
        } catch (UnsupportedEncodingException ex) {
            logger.error(ex);
            return "";
        }
    }

    public ResponseEntity<?> getExternalData(String baseUrl, Map<String, String> params, String proxyHost, Integer proxyPort, boolean isBinaryData) throws Exception {
        if (baseUrl != null && baseUrl.length() > 0 && params != null && params.size() > 0) {
            String paramString = params.entrySet().stream()
                    .map(UIService::getEncodedKeyValue)
                    .collect(Collectors.joining("&"));

            logger.debug(String.format("Sending request %s?%s", baseUrl, paramString));

            URL url = new URL(baseUrl + "?" + paramString);
            HttpURLConnection con;

            if (proxyHost != null && proxyPort != null) {
                Proxy proxy = new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHost, proxyPort));
                con = (HttpURLConnection) url.openConnection(proxy);
            }
            else {
                con = (HttpURLConnection) url.openConnection();
            }

            con.setRequestMethod("GET");
            con.setConnectTimeout(5000);
            con.setReadTimeout(30000);

            int status = con.getResponseCode();

            if (isBinaryData) {
                BufferedInputStream in;
                if (status > 299) {
                    in = new BufferedInputStream(con.getErrorStream());
                } else {
                    in = new BufferedInputStream(con.getInputStream());
                }

                ByteArrayOutputStream baos = new ByteArrayOutputStream(1024);
                byte[] bytes = new byte[1024];
                int read = 0;
                while ((read = in.read(bytes)) != -1) {
                    baos.write(bytes, 0, read);
                }

                con.disconnect();

                logger.debug(String.format("Response status %s for %s?%s", status, baseUrl, paramString));

                return ResponseEntity.status(status).body(baos.toByteArray());
            } else {
                Reader streamReader;
                if (status > 299) {
                    streamReader = new InputStreamReader(con.getErrorStream());
                } else {
                    streamReader = new InputStreamReader(con.getInputStream());
                }

                BufferedReader in = new BufferedReader(streamReader);
                String inputLine;
                StringBuffer content = new StringBuffer();
                while ((inputLine = in.readLine()) != null) {
                    content.append(inputLine);
                }
                in.close();

                con.disconnect();

                logger.debug(String.format("Response status %s for %s?%s", status, baseUrl, paramString));

                return ResponseEntity.status(status).body(content);
            }
        }
        else {
            logger.debug(String.format("Bad request: %s, %s", baseUrl, params));

            return ResponseEntity.badRequest().build();
        }
    }

    public SillariUser getSillariUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (!(principal instanceof SillariUser)) {
            throw new AccessDeniedException("User not SillariUser");
        }

        SillariUser user = (SillariUser) principal;
        Collection<GrantedAuthority> authorities = user.getAuthorities();
        user.setRoles(AuthorityUtils.authorityListToSet(authorities));
        return user;
    }

}
