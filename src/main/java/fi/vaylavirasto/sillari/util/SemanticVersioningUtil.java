package fi.vaylavirasto.sillari.util;

public class SemanticVersioningUtil {
    private static final String SEPARATOR = "\\.";

    public static String getMajorVersion(String versionNumber) {
        if (versionNumber == null) {
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

    public static String getPatchVersion(String versionNumber) {
        if (versionNumber == null) {
            return null;
        }
        String[] splitted = versionNumber.split(SEPARATOR);
        if (splitted.length < 3) {
            return null;
        } else {
            return splitted[2];
        }
    }


    public static boolean legalVersion(String clientVersionNumber, String serverVersionNumber) {
        return serverVersionNumber == null ||
                (isValidVersionNumber(clientVersionNumber)
                        && matchesMajorVersion(clientVersionNumber, serverVersionNumber)
                        && !tooNewMinorVersion(clientVersionNumber, serverVersionNumber)
                        && !tooNewPatchVersion(clientVersionNumber, serverVersionNumber));
    }

    private static boolean isValidVersionNumber(String clientVersionNumber) {
        try {
            Integer.valueOf(getMajorVersion(clientVersionNumber));
            Integer.valueOf(getMinorVersion(clientVersionNumber));
            Integer.valueOf(getPatchVersion(clientVersionNumber));
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private static boolean matchesMajorVersion(String clientVersionNumber, String serverVersionNumber) {

        String clientMajorVersion = getMajorVersion(clientVersionNumber);
        String serverMajorVersion = getMajorVersion(serverVersionNumber);

        if (clientMajorVersion == null) {
            return serverMajorVersion == null;
        }

        if (serverMajorVersion == null) {
            return clientMajorVersion == null;
        }

        return clientMajorVersion.equals(serverMajorVersion);
    }

    //If client has newer MINOR version, it's a breach. Client might be using new features not available yet.
    //Assumes version numbers are corrext format x.x.x where x int. 
    //Assumes no MAJOR number breach.
    private static boolean tooNewMinorVersion(String clientVersionNumber, String serverVersionNumber) {

        String clientMinorVersion = getMinorVersion(clientVersionNumber);
        String serverMinorVersion = getMinorVersion(serverVersionNumber);

        if (clientMinorVersion == null) {
            return serverMinorVersion == null;
        }

        if (serverMinorVersion == null) {
            return clientMinorVersion == null;
        }

        return Integer.valueOf(clientMinorVersion).compareTo(Integer.valueOf(serverMinorVersion)) > 0;
    }

    //If client has newer PATCH version, it's a breach. Client might be using new features not available yet.
    //Assumes version numbers are corrext format x.x.x where x int. 
    //Assumes no MAJOR number breach.
    private static boolean tooNewPatchVersion(String clientVersionNumber, String serverVersionNumber) {

        String clientPatchVersion = getPatchVersion(clientVersionNumber);
        String serverPatchVersion = getPatchVersion(serverVersionNumber);

        String clientMinorVersion = getMinorVersion(clientVersionNumber);
        String serverMinorVersion = getMinorVersion(serverVersionNumber);

        if (clientPatchVersion == null) {
            return serverPatchVersion == null;
        }

        if (serverPatchVersion == null) {
            return clientPatchVersion == null;
        }

        return Integer.valueOf(clientMinorVersion).compareTo(Integer.valueOf(serverMinorVersion))==0 && Integer.valueOf(clientPatchVersion).compareTo(Integer.valueOf(serverPatchVersion)) > 0;
    }
}
