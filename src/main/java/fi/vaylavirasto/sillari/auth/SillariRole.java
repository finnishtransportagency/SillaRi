package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class SillariRole {
    // NOTE: the real user roles will be added later
    private static final String SILLARI_TEST_SILLANVALVOJA = "SILLARI_TEST_SILLANVALVOJA";
    private static final String SILLARI_TEST_AJOJARJESTELIJA = "SILLARI_TEST_AJOJARJESTELIJA";
    private static final String SILLARI_TEST_KULJETTAJA = "SILLARI_TEST_KULJETTAJA";
    public static final SimpleGrantedAuthority SILLARI_TEST_SILLANVALVOJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_TEST_SILLANVALVOJA);
    public static final SimpleGrantedAuthority SILLARI_TEST_AJOJARJESTELIJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_TEST_AJOJARJESTELIJA);
    public static final SimpleGrantedAuthority SILLARI_TEST_KULJETTAJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_TEST_KULJETTAJA);

    public static SimpleGrantedAuthority fromString(String role) {
        switch (role) {
            case SILLARI_TEST_SILLANVALVOJA:
                return SILLARI_TEST_SILLANVALVOJA_AUTHORITY;
            case SILLARI_TEST_AJOJARJESTELIJA:
                return SILLARI_TEST_AJOJARJESTELIJA_AUTHORITY;
            case SILLARI_TEST_KULJETTAJA:
                return SILLARI_TEST_KULJETTAJA_AUTHORITY;
            default:
                return null;
        }
    }
}
