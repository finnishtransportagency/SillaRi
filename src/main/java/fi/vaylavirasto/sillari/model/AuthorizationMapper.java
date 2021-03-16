package fi.vaylavirasto.sillari.model;
import com.google.common.collect.Lists;

import fi.vaylavirasto.sillari.model.tables.Authorization;
import fi.vaylavirasto.sillari.model.tables.Company;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class AuthorizationMapper implements RecordMapper<Record,AuthorizationModel> {
    public static final Authorization authorization = Tables.AUTHORIZATION.as("a");

    @Nullable
    @Override
    public AuthorizationModel map(Record record) {
        AuthorizationModel authorizationModel = new AuthorizationModel();
        authorizationModel.setId(record.get(authorization.ID));
        authorizationModel.setPermissionId(record.get(authorization.PERMISSIONID));
        authorizationModel.setValidStartDate(record.get(authorization.VALIDSTARTDATE));
        authorizationModel.setValidEndDate(record.get(authorization.VALIDENDDATE));
        authorizationModel.setRoutes(Lists.newArrayList());
        return authorizationModel;
    }
}
