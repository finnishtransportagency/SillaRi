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

    @Test
    void resolveYTunnus() {
        JwtRequestFilter jwtRequestFilter = new JwtRequestFilter();
        String s = jwtRequestFilter.resolvePossibleLOBusinessId("LOSV03575029");
        assertEquals("0357502-9", s);

        s = jwtRequestFilter.resolvePossibleLOBusinessId("LO03575029");
        assertEquals("0357502-9", s);

        s = jwtRequestFilter.resolvePossibleLOBusinessId("LOL03575029");
        assertNull(s);

        s = jwtRequestFilter.resolvePossibleLOBusinessId("XX03575029");
        assertNull(s);
        
        s = jwtRequestFilter.resolvePossibleLOBusinessId("LO0357502");
        assertNull(s);

    }
}