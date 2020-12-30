package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class AddressModel {
    private long id;
    private String street;
    private String postalcode;
    private String city;
}
