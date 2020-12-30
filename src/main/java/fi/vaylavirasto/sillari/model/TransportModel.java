package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class TransportModel {
    private long id;
    private String title;
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
}
