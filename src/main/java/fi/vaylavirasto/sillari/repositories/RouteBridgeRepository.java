package fi.vaylavirasto.sillari.repositories;

import fi.vaylavirasto.sillari.mapper.BridgeMapper;
import fi.vaylavirasto.sillari.mapper.RouteBridgeMapper;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.Sequences;
import fi.vaylavirasto.sillari.model.tables.records.RouteBridgeRecord;
import fi.vaylavirasto.sillari.util.TableAlias;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.impl.DSL;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

import static org.jooq.impl.DSL.notExists;
import static org.jooq.impl.DSL.selectOne;

@Repository
public class RouteBridgeRepository {
    @Autowired
    private DSLContext dsl;

    public RouteBridgeModel getRouteBridge(Integer id) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ID.eq(id))
                .fetchOne(this::mapRouteBridgeRecordWithBridge);
    }

    public List<RouteBridgeModel> getRouteBridges(Integer routeId) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))
                .orderBy(TableAlias.routeBridge.ORDINAL)
                .fetch(this::mapRouteBridgeRecordWithBridge);
    }

    public List<RouteBridgeModel> getRouteBridgesWithExcessTransportNumbers() {
        return dsl.select().from(TableAlias.routeBridge)
                .where(TableAlias.routeBridge.MAX_TRANSPORTS_EXCEEDED.eq(true))
                .fetch(new RouteBridgeMapper());
    }

    public List<RouteBridgeModel> getRouteBridges(Integer routeId, Integer transportNumber) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))
                .and(TableAlias.routeBridge.TRANSPORT_NUMBER.eq(transportNumber))
                .orderBy(TableAlias.routeBridge.ORDINAL)
                .fetch(this::mapRouteBridgeRecordWithBridge);
    }

    public RouteBridgeModel getRouteBridge(Integer routeId, String bridgeIdentifier, Integer transportNumber) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))
                .and(TableAlias.routeBridge.TRANSPORT_NUMBER.eq(transportNumber))
                .and(TableAlias.bridge.IDENTIFIER.eq(bridgeIdentifier))
                .fetchOne(this::mapRouteBridgeRecordWithBridge);
    }

    public Map<Integer, List<RouteBridgeModel>> getRouteBridges(List<Integer> routeIds) {
        return dsl.selectFrom(TableAlias.routeBridge)
                .where(TableAlias.routeBridge.ROUTE_ID.in(routeIds))
                .orderBy(TableAlias.routeBridge.TRANSPORT_NUMBER, TableAlias.routeBridge.ORDINAL)
                .fetchGroups(RouteBridgeRecord::getRouteId, new RouteBridgeMapper());
    }

    public List<RouteBridgeModel> getRouteBridgesWithNoSupervisions(Integer routeId, String bridgeIdentifier) {
        return dsl.select().from(TableAlias.routeBridge)
                .leftJoin(TableAlias.bridge).on(TableAlias.bridge.ID.eq(TableAlias.routeBridge.BRIDGE_ID))
                .where(TableAlias.routeBridge.ROUTE_ID.eq(routeId))
                .and(TableAlias.routeBridge.TRANSPORT_NUMBER.notEqual(-1))
                .and(TableAlias.bridge.IDENTIFIER.eq(bridgeIdentifier))
                .and(notExists(selectOne()
                        .from(TableAlias.supervision)
                        .where(TableAlias.supervision.ROUTE_BRIDGE_ID.eq(TableAlias.routeBridge.ID))))
                .fetch(this::mapRouteBridgeRecordWithBridge);
    }

    private RouteBridgeModel mapRouteBridgeRecordWithBridge(Record record) {
        RouteBridgeMapper routeBridgeMapper = new RouteBridgeMapper();
        RouteBridgeModel routeBridge = routeBridgeMapper.map(record);
        if (routeBridge != null) {
            BridgeMapper bridgeMapper = new BridgeMapper();
            routeBridge.setBridge(bridgeMapper.map(record));
        }
        return routeBridge;
    }




    public Integer insertExtraRouteBridge(RouteBridgeModel extraRouteBridge) {
        return dsl.transactionResult(configuration -> {
            DSLContext ctx = DSL.using(configuration);
            Integer transportNumber = extraRouteBridge.getTransportNumber();
            if (transportNumber == null) {
                transportNumber = ctx.nextval(Sequences.SUPERVISION_EXTRA_TRANSPORTNUMBER_SEQ).intValue();
            }
            Record1<Integer> routeBridgeIdResult = ctx.insertInto(TableAlias.routeBridge,
                    TableAlias.routeBridge.ROUTE_ID,
                    TableAlias.routeBridge.BRIDGE_ID,
                    TableAlias.routeBridge.ORDINAL,
                    TableAlias.routeBridge.CROSSING_INSTRUCTION,
                    TableAlias.routeBridge.CONTRACT_NUMBER,
                    TableAlias.routeBridge.CONTRACT_BUSINESS_ID,
                    TableAlias.routeBridge.TRANSPORT_NUMBER,
                    TableAlias.routeBridge.MAX_TRANSPORTS_EXCEEDED)
                    .values(extraRouteBridge.getRouteId(),
                            extraRouteBridge.getBridgeId(),
                            extraRouteBridge.getOrdinal(),
                            extraRouteBridge.getCrossingInstruction(),
                            extraRouteBridge.getContractNumber(),
                            extraRouteBridge.getContractBusinessId(),
                            transportNumber,
                            extraRouteBridge.getMaxTransportsExceeded())
                    .returningResult(TableAlias.routeBridge.ID)
                    .fetchOne(); // Execute and return zero or one record;
            Integer routeBridgeId = routeBridgeIdResult != null ? routeBridgeIdResult.value1() : null;
            return routeBridgeId;
        });
    }
}
