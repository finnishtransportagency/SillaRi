package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.AxleChart;
import fi.vaylavirasto.sillari.model.tables.Permit;
import fi.vaylavirasto.sillari.model.tables.TransportDimensions;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.math.BigDecimal;
import java.util.ArrayList;

public class PermitMapper implements RecordMapper<Record, PermitModel> {
    public static final Permit permit = Tables.PERMIT.as("p");
    public static final AxleChart axleChart = Tables.AXLE_CHART.as("a");
    public static final TransportDimensions transportDimensions = Tables.TRANSPORT_DIMENSIONS.as("t");

    @Nullable
    @Override
    public PermitModel map(Record record) {
        PermitModel permitModel = new PermitModel();
        permitModel.setId(record.get(permit.ID));
        permitModel.setCompanyId(record.get(permit.COMPANY_ID));
        permitModel.setPermitNumber(record.get(permit.PERMIT_NUMBER));
        permitModel.setLeluVersion(record.get(permit.LELU_VERSION));
        permitModel.setLeluLastModifiedDate(record.get(permit.LELU_LAST_MODIFIED_DATE));
        permitModel.setValidStartDate(record.get(permit.VALID_START_DATE));
        permitModel.setValidEndDate(record.get(permit.VALID_END_DATE));
        permitModel.setTransportTotalMass(record.get(permit.TRANSPORT_TOTAL_MASS));
        permitModel.setAdditionalDetails(record.get(permit.ADDITIONAL_DETAILS));
        permitModel.setRoutes(new ArrayList<>());

        TransportDimensionsMapper transportDimensionsMapper = new TransportDimensionsMapper();
        permitModel.setTransportDimensions(transportDimensionsMapper.map(record));

        AxleChartMapper axleChartMapper = new AxleChartMapper();
        permitModel.setAxleChart(axleChartMapper.map(record));
        return permitModel;
    }
}
