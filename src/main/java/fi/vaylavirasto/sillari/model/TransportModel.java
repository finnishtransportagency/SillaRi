package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.Date;
import java.util.List;

@Data
public class TransportModel {
    private long id;
    private String title;
    private String beginDate;
    private String endDate;
    private AddressModel departureAddress;
    private AddressModel arrivalAddress;
    private CompanyModel company;
    private List<CrossingModel> crossings;
}
