package fi.vaylavirasto.sillari.service.trex;

import lombok.Data;

public @Data
class Keskipistesijainti {
    private Epsg4326 epsg4326;
    private Epsg3067 epsg3067;
    private Tarkkuustaso tarkkuustaso;
}