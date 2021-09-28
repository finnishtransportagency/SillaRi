package fi.vaylavirasto.sillari.model;

import fi.vaylavirasto.sillari.model.tables.Supervision;
import fi.vaylavirasto.sillari.model.tables.SupervisionReport;
import fi.vaylavirasto.sillari.model.tables.SupervisionStatus;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class SupervisionMapper implements RecordMapper<Record, SupervisionModel> {
    public static final Supervision supervision = Tables.SUPERVISION.as("sn");
    public static final SupervisionStatus supervisionStatus = Tables.SUPERVISION_STATUS.as("sns");
    public static final SupervisionReport supervisionReport = Tables.SUPERVISION_REPORT.as("snr");

    @Nullable
    @Override
    public SupervisionModel map(Record record) {
        SupervisionModel supervisionModel = new SupervisionModel();
        supervisionModel.setId(record.get(supervision.ID));
        supervisionModel.setRouteBridgeId(record.get(supervision.ROUTE_BRIDGE_ID));
        supervisionModel.setRouteTransportId(record.get(supervision.ROUTE_TRANSPORT_ID));
        supervisionModel.setPlannedTime(record.get(supervision.PLANNED_TIME));
        supervisionModel.setConformsToPermit(record.get(supervision.CONFORMS_TO_PERMIT));
        supervisionModel.setSupervisorType(record.get(supervision.SUPERVISOR_TYPE, new SupervisorTypeConverter(String.class, SupervisorType.class)));

        SupervisionStatusMapper statusMapper = new SupervisionStatusMapper();
        SupervisionStatusModel statusModel = statusMapper.map(record);
        if (statusModel != null && statusModel.getId() != null) {
            supervisionModel.setCurrentStatus(statusModel);
        }
        supervisionModel.setStatusHistory(new ArrayList<>());

        supervisionModel.setSupervisors(new ArrayList<>());

        SupervisionReportMapper reportMapper = new SupervisionReportMapper();
        SupervisionReportModel reportModel = reportMapper.map(record);
        if (reportModel != null && reportModel.getId() != null) {
            supervisionModel.setReport(reportModel);
        }

        supervisionModel.setImages(new ArrayList<>());

        return supervisionModel;
    }
}
