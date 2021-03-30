package fi.vaylavirasto.sillari.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LogManager.getLogger();

    private static String publicKey = null;
    private static PublicKey ecPublicKey = null;

    @Value("${spring.profiles.active:Unknown}")
    private String activeProfile;

    private String getPublicKey(String kid, boolean isForce) throws Exception {
        if (isForce || publicKey == null) {
            String url = "https://public-keys.auth.elb.eu-west-1.amazonaws.com/" + kid;
            HttpsURLConnection httpClient = (HttpsURLConnection) new URL(url).openConnection();
            httpClient.setRequestMethod("GET");
            httpClient.setRequestProperty("User-Agent", "Mozilla/5.0");
            int responseCode = httpClient.getResponseCode();

            logger.debug(String.format("Sending request %s", url));
            logger.debug(String.format("Response code %s", responseCode));

            String key = "";
            try (BufferedReader in = new BufferedReader(new InputStreamReader(httpClient.getInputStream()))) {
                StringBuilder response = new StringBuilder();
                String line;
                while ((line = in.readLine()) != null) {
                    response.append(line);
                }
                key = response.toString()
                        .replaceAll("-----BEGIN PUBLIC KEY-----", "")
                        .replaceAll("-----END PUBLIC KEY-----", "");

                logger.debug(String.format("Public key %s", key));
            }
            publicKey = key;
            ecPublicKey = null;
        }
        return publicKey;
    }

    private Claims decodeJWT(String jwt, String key) throws Exception {
        if (ecPublicKey == null) {
            byte[] publicKeyBytes = Base64.getDecoder().decode(key);
            X509EncodedKeySpec keySpec = new X509EncodedKeySpec(publicKeyBytes);
            KeyFactory keyFactory = KeyFactory.getInstance("EC");
            ecPublicKey = keyFactory.generatePublic(keySpec);
        }
        return Jwts.parserBuilder().setSigningKey(ecPublicKey).build().parseClaimsJws(jwt).getBody();
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            logger.debug(String.format("Path %s", request.getServletPath()));

            String jwt = request.getHeader("x-amzn-oidc-data");
            if (jwt == null || jwt.length() == 0) {
                jwt = request.getHeader("x-iam-data");
            }
            if (jwt != null) {
                /*
                Enumeration<String> headerNames = request.getHeaderNames();
                while (headerNames.hasMoreElements()) {
                    String key = headerNames.nextElement();
                    String value = request.getHeader(key);
                    logger.debug(String.format("Header %s=%s", key, value));
                }
                */

                String jwt_headers = jwt.split("\\.")[0];
                String decoded_jwt_headers = new String(Base64.getDecoder().decode(jwt_headers));
                JSONParser parser = new JSONParser();
                JSONObject json = (JSONObject) parser.parse(decoded_jwt_headers);

                // logger.debug(String.format("JWT headers json %s", json.toJSONString()));

                String key = getPublicKey((String) json.get("kid"),false);
                Claims claims;
                try {
                    claims = decodeJWT(jwt, key);
                } catch (SignatureException e) {
                    logger.debug("Invalid key, trying again");
                    key = getPublicKey((String) json.get("kid"),true);
                    claims = decodeJWT(jwt, key);
                }

                PreAuthenticatedAuthenticationToken authenticationToken = null;
                if (claims != null) {
                    String username = (String) claims.get("username");
                    String uid = (String) claims.get("custom:uid");
                    String userNameDetail = (uid != null) ? uid : username;
                    logger.debug(String.format("Username %s", userNameDetail));

                    String[] roles = ((String) claims.get("custom:rooli")).split("\\,");
                    logger.debug(String.format("Roles %s", String.join(",", roles)));

                    // claims.forEach((k, v) -> logger.debug(String.format("Claim %s=%s", k, v)));

                    // NOTE: this is just a test, the real user roles will be added later
                    List<GrantedAuthority> authorityList = new ArrayList<>();
                    authorityList.add(SillariRole.fromString("SILLARI_TEST"));
                    SillariUser userDetails = new SillariUser(userNameDetail, authorityList);

                    authenticationToken = new PreAuthenticatedAuthenticationToken(userDetails, null, authorityList);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                }

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            } else {
                logger.debug("No JWT header found");

                // NOTE: For development use only using maven profile 'local'
                PreAuthenticatedAuthenticationToken authenticationToken = null;
                if (activeProfile.equals("local")) {
                    logger.debug("Using local development authentication");

                    List<GrantedAuthority> authorityList = new ArrayList<>();
                    authorityList.add(SillariRole.fromString("SILLARI_TEST"));
                    SillariUser userDetails = new SillariUser("DEV_USER", authorityList);

                    authenticationToken = new PreAuthenticatedAuthenticationToken(userDetails, null, authorityList);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                }

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        } catch (Exception ex) {
            logger.error(ex);
        } finally {
            filterChain.doFilter(request, response);
        }
    }
}
