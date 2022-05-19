package fi.vaylavirasto.sillari.aws;

public class ObjectKeyGenerator {
    private static final String OBJECT_IDENTIFIER_COMMON_PREFIX = "SIL";
    public static final String IMAGE_KTV_PREFIX = "img";
    public static final String PDF_KTV_PREFIX = "pdf";
    private static final String OBJECT_KEY_COMMON_PREFIX = "supervision";

    public static String generateObjectIdentifier(String prefix, Integer id) {
        return OBJECT_IDENTIFIER_COMMON_PREFIX + "-" + prefix + "-" + id;
    }

    public static String generateObjectKey(String objectIdentifier, Integer supervisionId) {
        return OBJECT_KEY_COMMON_PREFIX + "_" + supervisionId + "_" + objectIdentifier;
    }

}
