import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager } from "react-query";
import { IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText } from "@ionic/react";
import warning from "../theme/icons/warning_yellow.svg";
import "./SendingListOfflineNotice.css";

const SendingListOfflineNotice = (): JSX.Element => {
  const { t } = useTranslation();

  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  useEffect(() => {
    onlineManager.subscribe(() => {
      setOnline(onlineManager.isOnline());
    });
  }, []);

  return (
    <IonItem className={`offlineNoticeItem ion-margin-top ${isOnline ? "ion-hide" : ""}`} lines="none">
      <IonGrid className="offlineNoticeGrid ion-padding">
        <IonRow>
          <IonCol size="1" className="ion-no-padding">
            <IonIcon className="otherIcon" icon={warning} />
          </IonCol>
          <IonCol className="ion-no-padding">
            <IonGrid className="ion-no-padding">
              <IonRow>
                <IonCol>
                  <IonText className="headingText">{t("sendingListOfflineNotice.title")}</IonText>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonText>{t("sendingListOfflineNotice.notice")}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default SendingListOfflineNotice;
