package fi.vaylavirasto.sillari.auth;

import org.junit.jupiter.api.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.jupiter.api.Assertions.*;

class JwtRequestFilterTest {

    @Test
    void removeSquareBrackets() {
        JwtRequestFilter jwtRequestFilter = new JwtRequestFilter();
        String s = jwtRequestFilter.removePossibleSquareBrackets("[Domain Users, LO-users, sillari_valvoja]");
        assertEquals("Domain Users, LO-users, sillari_valvoja", s);
    }

    @Test
    void removeSquareBracketsNoBrackets() {
        JwtRequestFilter jwtRequestFilter = new JwtRequestFilter();
        String s = jwtRequestFilter.removePossibleSquareBrackets("Domain Users, LO-users, sillari_sillanvalvoja");
        assertEquals("Domain Users, LO-users, sillari_sillanvalvoja", s);
    }
}