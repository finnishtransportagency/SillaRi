import React, { useEffect, useState } from "react";

import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import arrowRight from "../../theme/icons/arrow-right.svg";

import { useQuery } from "react-query";
import { getSupervisionNoPasscode } from "../../utils/supervisionBackendData";
import { onRetry } from "../../utils/backendData";

interface OwnListItemProps {
  supervisionId: number;
}

const OwnListItem = ({ supervisionId }: OwnListItemProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { data: supervision } = useQuery(["getSupervision", supervisionId], () => getSupervisionNoPasscode(supervisionId, dispatch), {
    retry: onRetry,
  });

  const navigateToBridgeDetail = () => {
    // dispatch({ type: actions.SET_SUPERVISION_LIST_TYPE, payload: supervisionListType });
    history.push(`/bridgedetail/${supervisionId}`);
  };
  return (
    <IonItem className="small-margin-bottom" lines="full">
      <IonGrid className="ion-no-margin ion-no-padding">
        <IonRow className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
          <IonCol size="9">
            <IonLabel>
              <IonLabel className="headingText">
                <IonText>{` (${t("bridgeCard.estimate")})`}</IonText>
              </IonLabel>
              <IonLabel className="headingText">{supervision?.routeBridge?.bridge.name}</IonLabel>
              <IonLabel>
                <small>{`${supervision?.routeBridge?.bridge.identifier}, ${supervision?.routeBridge?.bridge.municipality}`}</small>
              </IonLabel>
            </IonLabel>
          </IonCol>
          <IonCol size="auto">
            <IonButton
              size="default"
              fill="clear"
              onClick={() => {
                navigateToBridgeDetail();
              }}
            >
              <IonIcon className="otherIcon" icon={arrowRight} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default OwnListItem;
