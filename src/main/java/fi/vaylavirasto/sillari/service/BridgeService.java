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
        BridgeModel oldBridge = bridgeRepository.getBridge(bridge.getOid());
        if(oldBridge != null){
            bridgeRepository.updateBridge(bridge);
        }
        else{
            bridgeRepository.createBridge(bridge);
        }
    }
}