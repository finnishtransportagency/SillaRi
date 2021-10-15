import React from "react";
import { useTypedSelector } from "../store/store";
import { IonItem, IonLabel } from "@ionic/react";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getSupervisionList, onRetry } from "../utils/supervisionBackendData";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { DATE_FORMAT } from "../utils/constants";
import Moment from "react-moment";
import BridgeCard from "../components/BridgeCard";
import ISupervision from "../interfaces/ISupervision";
import { groupSupervisionsByDate } from "../utils/supervisionUtil";

const SupervisionList = (): JSX.Element => {
  const dispatch = useDispatch();

  const {
    supervisionList,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  // TODO use logged in user
  const username = "USER1";

  useQuery(["getSupervisionList", username], () => getSupervisionList(username, dispatch), { retry: onRetry });
  const groupedSupervisions = groupSupervisionsByDate(supervisionList);

  const noNetworkNoData = isFailed.getSupervisionList && supervisionList === undefined;

  return (
    <div className="listContainer">
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        groupedSupervisions.map((supervisionDay: ISupervisionDay, dIndex) => {
          const dayKey = `day${dIndex}`;

          return (
            <IonItem key={dayKey} lines="none">
              <IonLabel>
                <IonLabel className="headingText">
                  <Moment format={DATE_FORMAT}>{supervisionDay.date}</Moment>
                </IonLabel>
                <div className="listContainer">
                  {supervisionDay.supervisions.map((supervision: ISupervision, bIndex) => {
                    const bridgeKey = `bridge_${bIndex}`;
                    return <BridgeCard key={bridgeKey} routeBridge={supervision.routeBridge} />;
                  })}
                </div>
              </IonLabel>
            </IonItem>
          );
        })
      )}
    </div>
  );
};

export default SupervisionList;
