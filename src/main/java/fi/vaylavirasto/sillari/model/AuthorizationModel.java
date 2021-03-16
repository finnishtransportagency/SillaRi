package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class AuthorizationModel {
    private long id;
    private long companyId;
    private String permissionId;
    private String validStartDate;
    private String validEndDate;
    private List<RouteModel> routes;
}
