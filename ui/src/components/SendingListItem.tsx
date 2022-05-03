import React, { Dispatch, SetStateAction } from "react";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import ISupervision from "../interfaces/ISupervision";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./SendingList.css";
import { useTranslation } from "react-i18next";

interface SendingListItemProps {
  supervision: ISupervision;
  selectSupervision: (arg0: string, arg1: boolean) => void;
  setTargetUrl: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const SendingListItem = ({ supervision, selectSupervision, setTargetUrl, setOpen }: SendingListItemProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: supervisionId, routeBridge, routeTransport, startedTime, savedOffline } = supervision;
  const { bridge, route } = routeBridge || {};
  const { identifier = "", name = "" } = bridge || {};
  const { permit } = route || {};
  const { permitNumber } = permit || {};
  const { tractorUnit = "" } = routeTransport || {};

  return (
    <IonItem className="ion-margin-top" lines="none">
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol size="1">
            <IonCheckbox value={String(supervisionId)} onIonChange={(e) => selectSupervision(e.detail.value, e.detail.checked)} />
          </IonCol>
          <IonCol>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonLabel>
                    <IonText className="headingText">{name}</IonText>
                  </IonLabel>
                </IonCol>
                <IonCol size="3" className="ion-text-right">
                  <IonText>{identifier}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonLabel>{`${t("sendingList.transportPermit")}: ${permitNumber}`}</IonLabel>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonLabel>{`${t("sendingList.tractorUnit")}: ${tractorUnit}`}</IonLabel>
              </IonRow>
              <IonRow>
                <IonLabel>{`${t("sendingList.supervisionStarted")}: ${moment(startedTime).format(DATE_TIME_FORMAT_MIN)}`}</IonLabel>
                {savedOffline && (
                  <IonLabel className="sendingListOfflineSuffix">
                    <IonText className="headingText">{`(${t("sendingList.offlineSuffix")})`}</IonText>
                  </IonLabel>
                )}
              </IonRow>
              <IonRow>
                <IonButton
                  color="secondary"
                  size="default"
                  onClick={() => {
                    setTargetUrl(`/supervision/${supervisionId}`);
                    setOpen(false);
                  }}
                >
                  {t("common.buttons.edit")}
                </IonButton>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default SendingListItem;
