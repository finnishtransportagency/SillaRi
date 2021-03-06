package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;

    public BridgeModel getBridge(Integer bridgeId) {
        BridgeModel bridgeModel = bridgeRepository.getBridge(bridgeId);
        if (bridgeModel != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(bridgeId);
            bridgeModel.setGeojson(bridgeGeoJson);
        }
        return bridgeModel;
    }
}
