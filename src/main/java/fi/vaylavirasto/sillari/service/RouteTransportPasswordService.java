package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportPasswordRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

@Slf4j
@Service
public class RouteTransportPasswordService {
    @Autowired
    RouteTransportPasswordRepository rtpRepository;

    public RouteTransportPasswordModel findRouteTransportPassword(String transportPassword) {
        RouteTransportPasswordModel rtpModel = rtpRepository.findRouteTransportPassword(transportPassword);
        return rtpModel;
    }

    public boolean doesTransportPasswordMatch (String usernameAndPasswordHashed, String username, Integer routeTransportId) {
        RouteTransportPasswordModel rtpModel = rtpRepository.getTransportPassword(routeTransportId);
        if (rtpModel != null) {
            return doPasswordsMatch(usernameAndPasswordHashed, username, rtpModel.getTransportPassword());
        }
        return false;
    }

    private boolean doPasswordsMatch(String inputUsernameAndPasswordHashed, String username, String plainPasswordFromDb) {
        log.info("Trying to match:");
        log.info("inputUsernameAndPasswordHashed " + inputUsernameAndPasswordHashed);
        log.info("username " + username);
        log.info("plainPasswordFromDb " + plainPasswordFromDb);
        String hashOfUsernameAndPasswordFromDb = sha1(username + plainPasswordFromDb);
        log.info("hashOfUsernameAndPasswordFromDb: " + hashOfUsernameAndPasswordFromDb);

        return inputUsernameAndPasswordHashed.equals(hashOfUsernameAndPasswordFromDb);
    }

    private static String sha1(String string)
    {
        String sha1 = "";
        try
        {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(string.getBytes(StandardCharsets.UTF_8));
            sha1 = byteToHex(crypt.digest());
        }
        catch(NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        return sha1;
    }

    private static String byteToHex(final byte[] hash)
    {
        Formatter formatter = new Formatter();
        for (byte b : hash)
        {
            formatter.format("%02x", b);
        }
        String result = formatter.toString();
        formatter.close();
        return result;
    }

    public RouteTransportPasswordModel generateRouteTransportPassword(Integer routeTransportId) {
        // Generate a password but keep the same expiry date
        // This is used by the 'new password' button in the transport company admin UI
        rtpRepository.updateTransportPassword(routeTransportId, rtpRepository.generateUniqueTransportPassword());
        return rtpRepository.getTransportPassword(routeTransportId);
    }
}
