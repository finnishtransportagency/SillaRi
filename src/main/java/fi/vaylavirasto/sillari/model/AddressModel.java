package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class AddressModel {
    private Integer id;
    private String streetaddress;
    private String postalcode;
    private String city;
}
