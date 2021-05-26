package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class CompanyModel {
    private long id;
    private String name;
    private String businessId;
    private List<PermitModel> permits;
}
