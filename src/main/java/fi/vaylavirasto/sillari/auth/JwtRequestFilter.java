package fi.vaylavirasto.sillari.auth;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.SignatureException;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import fi.vaylavirasto.sillari.aws.AWSCognitoClient;
import fi.vaylavirasto.sillari.config.SillariConfig;

import javax.net.ssl.HttpsURLConnection;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.X509EncodedKeySpec;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {
    private static final Logger logger = LogManager.getLogger();

    private static String publicKey = null;
    private static PublicKey ecPublicKey = null;

    @Autowired
    private AWSCognitoClient awsCognitoClient;
    @Autowired
    private SillariConfig sillariConfig;

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

                /*if (!awsCognitoClient.isLoggedIn(jwt)) {
                    throw new RuntimeException("User not logged in Cognito");
                }*/

                String jwt_headers = jwt.split("\\.")[0];
                String decoded_jwt_headers = new String(Base64.getDecoder().decode(jwt_headers));
                JSONParser parser = new JSONParser();
                JSONObject json = (JSONObject) parser.parse(decoded_jwt_headers);

                // logger.debug(String.format("JWT headers json %s", json.toJSONString()));

                String key = getPublicKey((String) json.get("kid"), false);
                Claims claims;
                try {
                    claims = decodeJWT(jwt, key);
                } catch (SignatureException e) {
                    logger.debug("Invalid key, trying again");
                    key = getPublicKey((String) json.get("kid"), true);
                    claims = decodeJWT(jwt, key);
                }

                PreAuthenticatedAuthenticationToken authenticationToken = null;
                if (claims != null) {

                    claims.forEach((k, v) -> logger.debug(String.format("Claim %s=%s", k, v)));

                    String username = (String) claims.get("username");
                    String iss = (String) claims.get("iss");
                    String uid = (String) claims.get("custom:uid");
                    String userNameDetail = (uid != null) ? uid : username;

                    logger.debug(String.format("Username %s", userNameDetail));

                    String firstName = (String) claims.get("custom:etunimi");
                    String lastName = (String) claims.get("custom:sukunimi");
                    logger.debug(String.format("Name %s %s", firstName, lastName));

                    String email = (String) claims.get("email");
                    logger.debug(String.format("Email %s", email));

                    String phoneNumber = (String) claims.get("custom:puhelin");
                    logger.debug(String.format("Phone number %s", phoneNumber));

                    String businessId = (String) claims.get("custom:ytunnus");
                    if(businessId == null){
                        businessId = resolvePossibleLOBusinessId(userNameDetail);
                    }
                    logger.debug(String.format("Business ID %s", businessId));

                    String organization = (String) claims.get("custom:organisaatio");
                    logger.debug(String.format("Organization %s", organization));

                    String[] roles = (removePossibleSquareBrackets((String) claims.get("custom:rooli")).split("\\,"));
                    List<String> rolesList = new ArrayList<>(Arrays.asList(roles));
                    List<String> rolesListTrimmed = new ArrayList<>();
                    rolesList.forEach(i -> rolesListTrimmed.add(i.trim()));

                    logger.debug(String.format("Roles %s", String.join(",", rolesListTrimmed)));

                    List<GrantedAuthority> authorityList = new ArrayList<>();

                    if (rolesListTrimmed.contains("sillari_valvoja")
                            || rolesListTrimmed.contains("sillari_sillanvalvoja")) {
                        authorityList.add(SillariRole.fromString("SILLARI_SILLANVALVOJA"));
                    }
                    if (rolesListTrimmed.contains("sillari_ajojarjestelija")) {
                        authorityList.add(SillariRole.fromString("SILLARI_AJOJARJESTELIJA"));
                    }
                    if (rolesListTrimmed.contains("sillari_kuljettaja")) {
                        authorityList.add(SillariRole.fromString("SILLARI_KULJETTAJA"));
                    }

                    logger.debug("authorityList " + authorityList);

                    SillariUser userDetails = new SillariUser(userNameDetail, authorityList);

                    userDetails.setFirstName(firstName);
                    userDetails.setLastName(lastName);
                    userDetails.setEmail(email);
                    userDetails.setPhoneNumber(phoneNumber);
                    userDetails.setBusinessId(businessId);
                    userDetails.setOrganization(organization);
                    userDetails.setIss(iss);

                    authenticationToken = new PreAuthenticatedAuthenticationToken(userDetails, null, authorityList);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                }

                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                filterChain.doFilter(request, response);
            } else {
                logger.debug("No JWT header found");

                // NOTE: For development use only using maven profile 'local'
                PreAuthenticatedAuthenticationToken authenticationToken = null;
                if (activeProfile.equals("local")) {
                    logger.debug("Using local development authentication");

                    List<GrantedAuthority> authorityList = new ArrayList<>();
                    // NOTE: Add all roles. Each role (and combinations) can be tested by commenting row(s) out below
                    authorityList.add(SillariRole.fromString("SILLARI_SILLANVALVOJA"));
                    authorityList.add(SillariRole.fromString("SILLARI_AJOJARJESTELIJA"));
                    authorityList.add(SillariRole.fromString("SILLARI_KULJETTAJA"));

                    SillariUser userDetails = new SillariUser("T012345", authorityList);

                    userDetails.setFirstName("Etunimi");
                    userDetails.setLastName("Sukunimi");
                    userDetails.setEmail("etunimi.sukunimi@cgi.com");
                    userDetails.setPhoneNumber("0123456789");
                    userDetails.setBusinessId("0357502-9");
                    userDetails.setOrganization("CGI Suomi Oy");

                    authenticationToken = new PreAuthenticatedAuthenticationToken(userDetails, null, authorityList);
                    authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);                

                    filterChain.doFilter(request, response);
                }              
            }
        } catch (Exception ex) {
            logger.error(ex);
            //todo, like fi.vaylavirasto.sillari.api.rest.UIController.userLogout
/*            String url = sillariConfig.getAmazonCognito().getUrl();
            String clientId = sillariConfig.getAmazonCognito().getClientId();
            String redirectUrl = sillariConfig.getAmazonCognito().getRedirectUrl();*/

            //response.sendRedirect(url + "/logout?client_id=" + clientId + "&redirect_uri=" + URLEncoder.encode(redirectUrl, StandardCharsets.UTF_8) + "&response_type=code&scope=openid");
        } finally {            
           SecurityContextHolder.clearContext();
        }
    }

    protected String resolvePossibleLOBusinessId(String userNameDetail) {
        if(userNameDetail == null){
            return null;
        }
        if(!isLOOrLOSV(userNameDetail)){
            return null;
        }

        String numberPart = null;
        if(userNameDetail.startsWith("LOSV")){
            numberPart = userNameDetail.substring(4);
        }
        else if(userNameDetail.startsWith("LO")){
            numberPart = userNameDetail.substring(2);
        }

        if(numberPart == null){
            return null;
        }

        if(numberPart.length() < 8){
            return null;
        }

        String yTunnus = numberPart.substring(0,7) + "-" + numberPart.substring(7);

        return yTunnus;

    }


    // is the username form LO12309832 or LOSV98601767 where number part is y-tunnus without -
    private boolean isLOOrLOSV(String s) {
        String numberPart = null;
        if(s.startsWith("LOSV")){
            numberPart = s.substring(4);
        }
        else if(s.startsWith("LO")){
            numberPart = s.substring(2);
        }
        logger.debug("numberpart: " + numberPart);

        if(numberPart == null){
            return false;
        }

        return numberPart.matches("[0-9]+");
    }


    //LO and LOSV usernames have roolis in square bracketed form
    protected String removePossibleSquareBrackets(String s) {
        if (s.startsWith("[") && s.endsWith("]")) {
            return s.substring(1, s.length()-1);
        }
        return s;
    }
}

