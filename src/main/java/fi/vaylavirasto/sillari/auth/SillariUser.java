package fi.vaylavirasto.sillari.auth;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;

public class SillariUser extends User {
    // TODO - add application-specific user details later

    public SillariUser(String username, Collection<? extends GrantedAuthority> authorities) {
        super(username, "", authorities);
    }
}
