package fi.vaylavirasto.sillari;

import fi.vaylavirasto.sillari.util.TransportPasswordGenerator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class TransportPasswordTest {
    @Test
    void transportPasswordGenerateTest() {
        String password = TransportPasswordGenerator.generate();
        System.out.println(password);

        int il1Count = 0;
        int o0Count = 0;
        for (char c : password.toCharArray()) {
            if (c == 'I' || c == 'l' || c == '1') {
                il1Count++;
            }
            if (c == 'O' || c == '0') {
                o0Count++;
            }
        }

        Assertions.assertEquals(8, password.length(), "Password is 8 characters");
        Assertions.assertEquals(0, il1Count, "Password does not contain I, l, 1 characters");
        Assertions.assertEquals(0, o0Count, "Password does not contain O, 0 characters");
    }
}
