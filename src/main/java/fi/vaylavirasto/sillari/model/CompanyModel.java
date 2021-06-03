package fi.vaylavirasto.sillari.model;

import lombok.Data;

import java.util.List;

@Data
public class CompanyModel {
    private Integer id;
    private String name;
    private String businessId;
    private List<PermitModel> permits;
}
