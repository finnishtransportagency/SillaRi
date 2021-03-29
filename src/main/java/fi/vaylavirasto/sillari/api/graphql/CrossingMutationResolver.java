package fi.vaylavirasto.sillari.api.graphql;
import fi.vaylavirasto.sillari.model.BridgeModel;

import com.coxautodev.graphql.tools.GraphQLMutationResolver;
import fi.vaylavirasto.sillari.model.CrossingInputModel;
import fi.vaylavirasto.sillari.model.CrossingModel;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;

@Component
public class CrossingMutationResolver implements GraphQLMutationResolver  {
    @PreAuthorize("@sillariRightsChecker.isSillariUser(authentication)")
    public CrossingModel saveCrossing(CrossingInputModel crossingInputModel) {
        CrossingModel crossingModel = new CrossingModel();
        crossingModel.setId(0);
        crossingModel.setBridge(new BridgeModel());
        crossingModel.setDrivingLineInfo(false);
        crossingModel.setSpeedInfo(false);
        crossingModel.setExceptionsInfo(false);
        crossingModel.setDescribe(false);
        crossingModel.setDrivingLineInfoDesc("");
        crossingModel.setSpeedInfoDesc("");
        crossingModel.setExceptionsInfoDesc("");
        crossingModel.setExtraInfoDesc("");

        return crossingModel;
    }
}
