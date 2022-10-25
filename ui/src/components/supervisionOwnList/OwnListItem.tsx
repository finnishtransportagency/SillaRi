import React from "react";

import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText, useIonAlert } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import arrowRight from "../../theme/icons/arrow-right.svg";
import erase from "../../theme/icons/erase.svg";

import { useQuery } from "react-query";
import { getSupervisionNoPasscode } from "../../utils/supervisionBackendData";
import { onRetry } from "../../utils/backendData";

interface OwnListItemProps {
  supervisionId: number;
  removalCallback: (supervisionId: number | undefined) => void;
}

const OwnListItem = ({ supervisionId, removalCallback }: OwnListItemProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [present] = useIonAlert();

  const { data: supervision } = useQuery(["getSupervision", supervisionId], () => getSupervisionNoPasscode(supervisionId, dispatch), {
    retry: onRetry,
  });

  const navigateToBridgeDetail = () => {
    // dispatch({ type: actions.SET_SUPERVISION_LIST_TYPE, payload: supervisionListType });
    history.push(`/bridgedetail/${supervisionId}`);
  };

  const showConfirmRemoveSupervision = () => {
    present({
      header: t("supervisionOwnList.warning.removeHeader"),
      buttons: [
        t("common.buttons.back2"),
        {
          text: t("supervisionOwnList.warning.remove"),
          handler: () => {
            removalCallback(supervision?.id);
          },
        },
      ],
    });
  };

  function removeSupervisionClicked() {
    console.log("del");
    showConfirmRemoveSupervision();
  }

  return (
    <IonItem className="small-margin-bottom" lines="full">
      <IonGrid className="ion-no-margin ion-no-padding">
        <IonRow className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
          <IonCol size="9">
            <IonLabel>
              <IonLabel className="headingText">
                <IonText>{`${supervision?.routeBridge?.bridge.identifier} ${supervision?.routeBridge?.bridge.name}, ${supervision?.routeBridge?.bridge.municipality}`}</IonText>
              </IonLabel>
              <IonLabel>
                <small>{`${supervision?.routeBridge?.route.name}`}</small>
              </IonLabel>
              <IonLabel>
                <small>{`${t("supervisionOwnList.permitLabel")} ${supervision?.routeBridge?.route.permit.permitNumber}`}</small>
              </IonLabel>
              <IonLabel>
                <small>{t("supervisionOwnList.addedBySupervisor")}</small>
                <IonButton size="default" fill="clear" onClick={() => removeSupervisionClicked()}>
                  <IonIcon className="otherIcon" icon={erase} />
                  <small>{t("supervisionOwnList.removeFromList")}</small>
                </IonButton>
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
