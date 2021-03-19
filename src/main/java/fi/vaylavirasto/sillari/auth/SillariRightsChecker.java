package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SillariRightsChecker {
    public boolean isSillariUser(Authentication authentication) {
        return (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null
                && authentication.getAuthorities() != null && authentication.getAuthorities().contains(SillariRole.SILLARI_TEST_AUTHORITY));
    }

    // TODO - add checks for more specific user groups later
}
