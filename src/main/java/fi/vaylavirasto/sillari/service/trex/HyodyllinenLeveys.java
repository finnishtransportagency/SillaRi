package fi.vaylavirasto.sillari.service.trex;

import com.fasterxml.jackson.annotation.JsonProperty;

public class HyodyllinenLeveys {

    @JsonProperty("minimi")
    private Minimi minimi;

    @JsonProperty("maksimi")
    private Maksimi maksimi;
}