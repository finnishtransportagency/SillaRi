package fi.vaylavirasto.sillari.api.rest.error;

public class APIVersionException extends Exception {
    public APIVersionException() {
    }

    public APIVersionException(String message) {
        super(message);
    }

}
