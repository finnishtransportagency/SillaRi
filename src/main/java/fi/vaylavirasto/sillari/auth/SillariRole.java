package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.authority.SimpleGrantedAuthority;

public class SillariRole {

    public static final String SILLARI_SILLANVALVOJA = "SILLARI_SILLANVALVOJA";
    public static final String SILLARI_AJOJARJESTELIJA = "SILLARI_AJOJARJESTELIJA";
    public static final String SILLARI_KULJETTAJA = "SILLARI_KULJETTAJA";
    public static final SimpleGrantedAuthority SILLARI_SILLANVALVOJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_SILLANVALVOJA);
    public static final SimpleGrantedAuthority SILLARI_AJOJARJESTELIJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_AJOJARJESTELIJA);
    public static final SimpleGrantedAuthority SILLARI_KULJETTAJA_AUTHORITY = new SimpleGrantedAuthority(SILLARI_KULJETTAJA);

    public static SimpleGrantedAuthority fromString(String role) {
        switch (role) {
            case SILLARI_SILLANVALVOJA:
                return SILLARI_SILLANVALVOJA_AUTHORITY;
            case SILLARI_AJOJARJESTELIJA:
                return SILLARI_AJOJARJESTELIJA_AUTHORITY;
            case SILLARI_KULJETTAJA:
                return SILLARI_KULJETTAJA_AUTHORITY;
            default:
                return null;
        }
    }
}
