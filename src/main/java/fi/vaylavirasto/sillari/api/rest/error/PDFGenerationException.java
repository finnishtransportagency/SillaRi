package fi.vaylavirasto.sillari.api.rest.error;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PDFGenerationException extends Exception {


    public PDFGenerationException() {
    }

    public PDFGenerationException(String message) {
        super(message);
    }

}
