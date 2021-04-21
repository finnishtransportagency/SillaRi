package fi.vaylavirasto.sillari.model;

import lombok.Data;

@Data
public class TransportRegistrationModel {
    private long id;
    private long transportId;
    private String registrationNumber;
}
