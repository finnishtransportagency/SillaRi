import React from "react";
import { useTypedSelector } from "../store/store";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getSupervisionList, onRetry } from "../utils/backendData";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { DATE_TIME_FORMAT } from "../utils/constants";
import Moment from "react-moment";
import BridgeCard from "../components/BridgeCard";
import ISupervision from "../interfaces/ISupervision";
import { groupSupervisionsByDate } from "../utils/supervisionUtil";

const SupervisionList = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    supervisionList,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);

  // TODO use logged in user
  const username = "USER1";

  useQuery(["getSupervisionList", username], () => getSupervisionList(username, dispatch), { retry: onRetry });
  const groupedSupervisions = groupSupervisionsByDate(supervisionList);

  const noNetworkNoData = isFailed.getSupervisionList && supervisionList === undefined;

  return (
    <div>
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        <IonGrid className="ion-no-padding" fixed>
          {groupedSupervisions.map((supervisionDay: ISupervisionDay, index) => {
            const key = `supervisionDay_${index}`;

            return (
              <IonRow key={key}>
                <IonCol className="ion-text-left">
                  <IonText className="headingText">
                    <Moment format={DATE_TIME_FORMAT}>{supervisionDay.date}</Moment>
                  </IonText>
                </IonCol>
                <div className="cardListContainer">
                  {supervisionDay.supervisions.map((supervision: ISupervision, idx) => {
                    const bridgeKey = `bridge_${idx}`;
                    return <BridgeCard key={bridgeKey} routeBridge={supervision.routeBridge} />;
                  })}
                </div>
              </IonRow>
            );
          })}
        </IonGrid>
      )}
    </div>
  );
};

export default SupervisionList;
