package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;

    public BridgeModel createOrUpdateBridge(Integer id) {
        BridgeModel bridgeModel = bridgeRepository.getBridge(id);
        if (bridgeModel != null && bridgeModel.getBridge() != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(bridgeModel.getBridge().getId());
            bridgeModel.getBridge().setGeojson(bridgeGeoJson);
        }
        return bridgeModel;
    }

}