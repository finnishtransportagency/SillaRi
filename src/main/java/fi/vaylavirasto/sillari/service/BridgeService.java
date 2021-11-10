package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;

    public void createOrUpdateBridge(BridgeModel bridge) {

    }

    public BridgeModel getBridge(String oid) {
        return bridgeRepository.getBridge(oid);
    }

    public void updateBridge(BridgeModel bridge) {
        bridgeRepository.update(bridge);
    }

    public void insertBridge(BridgeModel bridge) {
        bridgeRepository.insert(bridge);
    }
}