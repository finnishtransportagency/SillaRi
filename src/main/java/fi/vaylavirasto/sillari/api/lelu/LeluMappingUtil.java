package fi.vaylavirasto.sillari.api.lelu;

public class LeluMappingUtil {
    public static String splitAddress1(String address) {
        try {
            return address.split(",")[0];
        } catch (IndexOutOfBoundsException indexOutOfBoundsException) {
            return "";
        }
    }

    public static String splitAddress2(String address, int partNumber) {
        try {
            return address.split(",")[1].trim().split(" ")[partNumber];
        } catch (IndexOutOfBoundsException indexOutOfBoundsException) {
            return "";
        }
    }
}
