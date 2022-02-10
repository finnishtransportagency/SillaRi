package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class SillariRightsChecker {
    public boolean isSillariUser(Authentication authentication) {
        return (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null
                && authentication.getAuthorities() != null &&
                (
                    authentication.getAuthorities().contains(SillariRole.SILLARI_SILLANVALVOJA_AUTHORITY) ||
                    authentication.getAuthorities().contains(SillariRole.SILLARI_AJOJARJESTELIJA_AUTHORITY) ||
                    authentication.getAuthorities().contains(SillariRole.SILLARI_KULJETTAJA_AUTHORITY)
                ));
    }

    public boolean isSillariKuljettaja(Authentication authentication) {
        return (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null
                && authentication.getAuthorities() != null &&
                (
                    authentication.getAuthorities().contains(SillariRole.SILLARI_KULJETTAJA_AUTHORITY)
                ));
    }

    public boolean isSillariAjojarjestelija(Authentication authentication) {
        return (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null
                && authentication.getAuthorities() != null &&
                (
                        authentication.getAuthorities().contains(SillariRole.SILLARI_AJOJARJESTELIJA_AUTHORITY)
                ));
    }

    public boolean isSillariSillanvalvoja(Authentication authentication) {
        return (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() != null
                && authentication.getAuthorities() != null &&
                (
                        authentication.getAuthorities().contains(SillariRole.SILLARI_SILLANVALVOJA_AUTHORITY)
                ));
    }
}
