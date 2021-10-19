package fi.vaylavirasto.sillari.mapper;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jetbrains.annotations.Nullable;
import org.jooq.Record;
import org.jooq.RecordMapper;

import java.util.ArrayList;

public class BridgeMapper implements RecordMapper<Record, BridgeModel> {
    @Nullable
    @Override
    public BridgeModel map(Record record) {
        BridgeModel model = new BridgeModel();
        model.setId(record.get(TableAlias.bridge.ID));
        model.setOid(record.get(TableAlias.bridge.OID));
        model.setIdentifier(record.get(TableAlias.bridge.IDENTIFIER));
        model.setName(record.get(TableAlias.bridge.NAME));
        model.setRoadAddress(record.get(TableAlias.bridge.ROAD_ADDRESS));
        model.setMunicipality(record.get(TableAlias.bridge.MUNICIPALITY));
        model.setRouteBridges(new ArrayList<>());
        return model;
    }
}
