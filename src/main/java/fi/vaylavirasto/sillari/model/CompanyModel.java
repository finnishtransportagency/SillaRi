package fi.vaylavirasto.sillari.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Objects;

@Data
public class CompanyModel extends BaseModel {
    private Integer id;
    private String name;
    private String businessId;
    private List<PermitModel> permits;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CompanyModel that = (CompanyModel) o;
        return businessId.equals(that.businessId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(businessId);
    }
}
