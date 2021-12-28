package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

public class RouteBridgeMapper implements RecordMapper<Record, RouteBridgeModel> {
    @Nullable
    @Override
    public RouteBridgeModel map(Record record) {
        RouteBridgeModel model = new RouteBridgeModel();
        model.setId(record.get(TableAlias.routeBridge.ID));
        model.setRouteId(record.get(TableAlias.routeBridge.ROUTE_ID));
        model.setBridgeId(record.get(TableAlias.routeBridge.BRIDGE_ID));
        model.setOrdinal(record.get(TableAlias.routeBridge.ORDINAL));
        model.setCrossingInstruction(record.get(TableAlias.routeBridge.CROSSING_INSTRUCTION));
        model.setContractNumber(record.get(TableAlias.routeBridge.CONTRACT_NUMBER));
        model.setRowCreatedTime(record.get(TableAlias.routeBridge.ROW_CREATED_TIME));
        model.setRowUpdatedTime(record.get(TableAlias.routeBridge.ROW_UPDATED_TIME));
        return model;
    }
}
