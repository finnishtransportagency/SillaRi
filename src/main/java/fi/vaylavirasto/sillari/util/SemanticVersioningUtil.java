package fi.vaylavirasto.sillari.util;

public class SemanticVersioningUtil {
    private static final String SEPARATOR = "\\.";

    public static String getMajorVersion(String versionNumber){
        if(versionNumber == null){
            return null;
        }
        String[] splitted = versionNumber.split(SEPARATOR);
        if(splitted.length ==0){
            return null;
        }
        else{
            return splitted[0];
        }
    }


    public static boolean matchesMajorVersion(String versionNumber1, String versionNumber2){

        String majorVersion1 = getMajorVersion(versionNumber1);
        String majorVersion2 = getMajorVersion(versionNumber2);

        if(majorVersion1 == null){
            return majorVersion2 == null;
        }

        if(majorVersion2 == null){
            return majorVersion1 == null;
        }

        return majorVersion1.equals(majorVersion2);
    }
}
