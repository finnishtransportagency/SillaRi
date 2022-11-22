package fi.vaylavirasto.sillari.auth;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import java.util.Collection;
import java.util.Set;

public class SillariUser extends User {

    @Getter @Setter private String firstName;
    @Getter @Setter private String lastName;
    @Getter @Setter private String email;
    @Getter @Setter private String phoneNumber;
    @Getter @Setter private String businessId;
    @Getter @Setter private String organization;
    @Getter @Setter private String iss;
    @Getter @Setter private Set<String> roles;

    public SillariUser(String username, Collection<? extends GrantedAuthority> authorities) {
        super(username, "", authorities);
    }


}
