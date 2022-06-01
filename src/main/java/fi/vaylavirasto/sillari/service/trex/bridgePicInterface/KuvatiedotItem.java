package fi.vaylavirasto.sillari.service.trex.bridgePicInterface;

import java.util.List;

import lombok.Data;

public @Data
class KuvatiedotItem {
    private Kuvaluokka kuvaluokka;
    private List<Object> kuvaluokkatarkenne;
    private int id;
    private Paakuva paakuva;
    private String muokattu;
    private String luotu;
}