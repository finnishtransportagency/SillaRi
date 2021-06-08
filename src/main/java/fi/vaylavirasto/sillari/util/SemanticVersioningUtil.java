package fi.vaylavirasto.sillari.util;

public class SemanticVersioningUtil {
    private static final String SEPARATOR = "\\.";

    public static String getMajorVersion(String versionNumber){
        if(versionNumber == null){
            return null;
        }
        String[] splitted = versionNumber.split(SEPARATOR);
        if (splitted.length == 0) {
            return null;
        } else {
            return splitted[0];
        }
    }

    public static String getMinorVersion(String versionNumber) {
        if (versionNumber == null) {
            return null;
        }
        String[] splitted = versionNumber.split(SEPARATOR);
        if (splitted.length < 2) {
            return null;
        } else {
            return splitted[1];
        }
    }


    public static boolean legalVersion(String versionNumber1, String versionNumber2) {
        return matchesMajorVersion(versionNumber1, versionNumber2) && !tooNewMinorVersion(versionNumber1, versionNumber2);
    }

    private static boolean matchesMajorVersion(String versionNumber1, String versionNumber2) {

        String majorVersion1 = getMajorVersion(versionNumber1);
        String majorVersion2 = getMajorVersion(versionNumber2);

        if (majorVersion1 == null) {
            return majorVersion2 == null;
        }

        if (majorVersion2 == null) {
            return majorVersion1 == null;
        }

        return majorVersion1.equals(majorVersion2);
    }

    //If client has newer MINOR version, it's a breach. Client might be using new features not available yet.
    private static boolean tooNewMinorVersion(String versionNumber1, String versionNumber2) {

        String minorVersion1 = getMinorVersion(versionNumber1);
        String minorVersion2 = getMinorVersion(versionNumber2);

        if (minorVersion1 == null) {
            return minorVersion2 == null;
        }

        if (minorVersion2 == null) {
            return minorVersion1 == null;
        }

        return minorVersion1.equals(minorVersion2);
    }
}
