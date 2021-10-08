package fi.vaylavirasto.sillari.service;

import fi.vaylavirasto.sillari.model.BridgeModel;
import fi.vaylavirasto.sillari.model.RouteBridgeModel;
import fi.vaylavirasto.sillari.model.SupervisionModel;
import fi.vaylavirasto.sillari.repositories.BridgeRepository;
import fi.vaylavirasto.sillari.repositories.RouteBridgeRepository;
import fi.vaylavirasto.sillari.repositories.SupervisionStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BridgeService {
    @Autowired
    BridgeRepository bridgeRepository;
    @Autowired
    RouteBridgeRepository routeBridgeRepository;
    @Autowired
    SupervisionStatusRepository supervisionStatusRepository;

    public BridgeModel getBridge(Integer bridgeId) {
        BridgeModel bridgeModel = bridgeRepository.getBridge(bridgeId);
        if (bridgeModel != null) {
            String bridgeGeoJson = bridgeRepository.getBridgeGeoJson(bridgeId);
            bridgeModel.setGeojson(bridgeGeoJson);
        }
        return bridgeModel;
    }

}
