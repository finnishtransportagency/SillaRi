package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class SillariRole {
    // NOTE: the real user roles will be added later
    private static final String SILLARI_TEST = "SILLARI_TEST";
    public static final SimpleGrantedAuthority SILLARI_TEST_AUTHORITY = new SimpleGrantedAuthority(SILLARI_TEST);

    public static SimpleGrantedAuthority fromString(String role) {
        switch (role) {
            case SILLARI_TEST:
                return SILLARI_TEST_AUTHORITY;
            default:
                return null;
        }
    }
}
