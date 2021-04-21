import React from "react";
import BridgeCardList from "../components/BridgeCardList";
import { useTypedSelector } from "../store/store";

const UpcomingBridgeSupervisions = (): JSX.Element => {
  // Use previously selected route bridges for now
  const { selectedRouteDetail } = useTypedSelector((state) => state.crossingsReducer);
  const { routeBridges = [] } = selectedRouteDetail || {};

  return (
    <div className="cardListContainer">
      <BridgeCardList routeBridges={routeBridges} />
    </div>
  );
};

export default UpcomingBridgeSupervisions;
