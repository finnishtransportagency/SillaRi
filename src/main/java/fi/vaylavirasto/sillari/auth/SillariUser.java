package fi.vaylavirasto.sillari.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Set;

public class SillariUser extends User {
    @Getter
    @Setter
    private Set<String> roles;
    // TODO - add application-specific user details later

    public SillariUser(String username, Collection<? extends GrantedAuthority> authorities) {
        super(username, "", authorities);
    }
}
