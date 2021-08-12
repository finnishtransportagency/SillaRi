package fi.vaylavirasto.sillari.api.rest;

public class LeluRouteUploadResponseWrapper {
    private Integer result;
    private String message;

    public LeluRouteUploadResponseWrapper(Integer result, String message) {
        this.result = result;
        this.message = message;
    }

    public Integer getResult() {
        return result;
    }

    public void setResult(Integer result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return message;
    }

}
