package fi.vaylavirasto.sillari.service;

import com.amazonaws.services.elasticmapreduce.model.ScalingTrigger;
import fi.vaylavirasto.sillari.model.RouteTransportPasswordModel;
import fi.vaylavirasto.sillari.repositories.RouteTransportPasswordRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.UnsupportedEncodingException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

@Service
public class RouteTransportPasswordService {
    private static final Logger logger = LogManager.getLogger();

    @Autowired
    RouteTransportPasswordRepository rtpRepository;

    public RouteTransportPasswordModel findRouteTransportPassword(String transportPassword) {
        RouteTransportPasswordModel rtpModel = rtpRepository.findRouteTransportPassword(transportPassword);
        return rtpModel;
    }



    public boolean doesTransportPasswordMatch (String usernameAndPasswordHashed, String username, Integer routeTransportId) {
        RouteTransportPasswordModel rtpModel = rtpRepository.getTransportPassword(routeTransportId);
        return doesTransportPasswordMatch(usernameAndPasswordHashed, username, rtpModel.getTransportPassword());
    }

    private boolean doesTransportPasswordMatch (String inputUsernameAndPasswordHashed, String username, String plainPasswordFromDb) {
        logger.debug("Trying to match:");
        logger.debug("inputUsernameAndPasswordHashed " + inputUsernameAndPasswordHashed);
        logger.debug("username " + username);
        logger.debug("plainPasswordFromDb " + plainPasswordFromDb);
        String hashOfUsernameAndPasswordFromDb = sha1(username + plainPasswordFromDb);
        logger.debug("hashOfUsernameAndPasswordFromDb: " + hashOfUsernameAndPasswordFromDb);

        return inputUsernameAndPasswordHashed.equals(hashOfUsernameAndPasswordFromDb);
    }

    private static String sha1(String string)
    {
        String sha1 = "";
        try
        {
            MessageDigest crypt = MessageDigest.getInstance("SHA-1");
            crypt.reset();
            crypt.update(string.getBytes("UTF-8"));
            sha1 = byteToHex(crypt.digest());
        }
        catch(NoSuchAlgorithmException e)
        {
            e.printStackTrace();
        }
        catch(UnsupportedEncodingException e)
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
