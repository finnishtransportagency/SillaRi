package fi.vaylavirasto.sillari.aws;

import java.util.Arrays;

import org.springframework.stereotype.Component;

import com.amazonaws.regions.Regions;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProvider;
import com.amazonaws.services.cognitoidp.AWSCognitoIdentityProviderClientBuilder;
import com.amazonaws.services.cognitoidp.model.AWSCognitoIdentityProviderException;
import com.amazonaws.services.cognitoidp.model.GetUserRequest;

@Component
public class AWSCognitoClient {
    
    private final String environment;

    public AWSCognitoClient() {
        environment = System.getenv("environment");        
    }

    public boolean isLoggedIn(String accessToken) {
        if (Arrays.asList("localhost", "local").contains(environment)) {
            return true;
        }

        GetUserRequest getUserRequest = new GetUserRequest();
        getUserRequest.setAccessToken(accessToken);
        
        try {
            getAmazonCognitoIdentityClient().getUser(getUserRequest);
        } catch(AWSCognitoIdentityProviderException e) {
            return false;
        }
        

        return true;
    }
    
    public AWSCognitoIdentityProvider getAmazonCognitoIdentityClient() { 
         return AWSCognitoIdentityProviderClientBuilder.standard()
            .withRegion(Regions.EU_WEST_1)
            .build();
     }

}
