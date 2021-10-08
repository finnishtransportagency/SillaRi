import React from "react";
import { useTypedSelector } from "../store/store";
import { IonCol, IonGrid, IonRow } from "@ionic/react";
import NoNetworkNoData from "../components/NoNetworkNoData";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { getSupervisionList, onRetry } from "../utils/backendData";

const SupervisionList = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const {
    supervisorSupervisionList,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.crossingsReducer);

  // TODO use logged in user
  const username = "USER1";

  useQuery(["getSupervisionList", username], () => getSupervisionList(username, dispatch), { retry: onRetry });

  const noNetworkNoData = isFailed.getSupervisionList && supervisorSupervisionList === undefined;

  return (
    <div>
      {noNetworkNoData ? (
        <NoNetworkNoData />
      ) : (
        <IonGrid className="ion-no-padding" fixed>
          <IonRow>
            <IonCol className="whiteBackground">
              <IonGrid className="ion-no-padding">
                <IonRow>
                  <IonCol></IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      )}
    </div>
  );
};

export default SupervisionList;
