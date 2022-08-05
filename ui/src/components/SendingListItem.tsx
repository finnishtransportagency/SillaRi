import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IonButton, IonCheckbox, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import ISupervision from "../interfaces/ISupervision";
import { DATE_TIME_FORMAT_MIN, SupervisionListType } from "../utils/constants";
import "./SendingList.css";
import { useTranslation } from "react-i18next";
import { getPasswordFromStorage } from "../utils/trasportCodeStorageUtil";
import lock from "../theme/icons/lock_closed_white.svg";
import SupervisionPasswordPopover from "./SupervisionPasswordPopover";
import IPopoverPlacement from "../interfaces/IPopoverPlacement";

interface SendingListItemProps {
  supervision: ISupervision;
  selectSupervision: (arg0: string, arg1: boolean) => void;
  setTargetUrl: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  isOnline: boolean;
  username: string;
}

const SendingListItem = ({ supervision, selectSupervision, setTargetUrl, setOpen, isOnline, username }: SendingListItemProps): JSX.Element => {
  const { t } = useTranslation();
  const [supervisionUnlocked, setSupervisionUnlocked] = useState<boolean>(false);
  const [passwordPopoverOpen, setPasswordPopoverOpen] = useState<boolean>(false);

  const { id: supervisionId, routeTransportId, routeBridge, routeTransport, startedTime, savedOffline } = supervision;
  const { bridge, route } = routeBridge || {};
  const { identifier = "", name = "" } = bridge || {};
  const { permit } = route || {};
  const { permitNumber } = permit || {};
  const { tractorUnit = "" } = routeTransport || {};

  const passwordPopoverTriggerId = `passwordTrigger_sendingListItem_${supervisionId}`;
  const passwordTitle = `${moment(startedTime).format(DATE_TIME_FORMAT_MIN)} ${name}`;
  const popoverPlacementProps: IPopoverPlacement = { trigger: passwordPopoverTriggerId, side: "bottom", alignment: "start" };

  // FIXME how to get the supervisionUnlocked to refresh without getting error?
  const openSupervision = () => console.log("Password provided");

  useEffect(() => {
    // Must set supervisionUnlocked inside useEffect, since Storage returns a promise
    if (username) {
      getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId).then((result) => {
        if (result) {
          console.log("setSupervisionUnlocked", supervisionId);
          setSupervisionUnlocked(true);
        }
      });
    }
  }, [username, supervisionId]);

  return (
    <IonItem className="ion-margin-top" lines="none">
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonCol size="1">
            <IonCheckbox
              value={String(supervisionId)}
              disabled={!isOnline || !supervisionUnlocked}
              onIonChange={(e) => selectSupervision(e.detail.value, e.detail.checked)}
            />
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
                <IonLabel>{`${t("sendingList.tractorUnit")}: ${tractorUnit ? tractorUnit.toUpperCase() : ""}`}</IonLabel>
              </IonRow>
              <IonRow>
                <IonLabel>{`${t("sendingList.supervisionStarted")}: ${moment(startedTime).format(DATE_TIME_FORMAT_MIN)}`}</IonLabel>
                {savedOffline && (
                  <IonLabel className="sendingListOfflineSuffix">
                    <IonText className="headingText">{`(${t("sendingList.offlineSuffix")})`}</IonText>
                  </IonLabel>
                )}
              </IonRow>
              <IonRow className="small-margin-top small-margin-bottom">
                {supervisionUnlocked ? (
                  <IonCol>
                    <IonButton
                      color="secondary"
                      size="default"
                      disabled={!supervisionUnlocked}
                      onClick={() => {
                        setTargetUrl(`/supervision/${supervisionId}`);
                        setOpen(false);
                      }}
                    >
                      {t("common.buttons.edit")}
                    </IonButton>
                  </IonCol>
                ) : (
                  <IonCol>
                    <IonButton
                      id={passwordPopoverTriggerId}
                      size="default"
                      color="secondary"
                      disabled={!isOnline}
                      onClick={() => {
                        setPasswordPopoverOpen(true);
                      }}
                    >
                      <IonIcon className="otherIcon" icon={lock} />
                      <IonText className="headingText medium-margin-start medium-margin-end">{t("sendingList.passwordButton")}</IonText>
                    </IonButton>
                    <SupervisionPasswordPopover
                      title={passwordTitle}
                      isOpen={passwordPopoverOpen}
                      setOpen={setPasswordPopoverOpen}
                      routeTransportId={routeTransportId}
                      supervisions={[supervision]}
                      supervisionListType={SupervisionListType.BRIDGE}
                      openSupervision={openSupervision}
                      popoverPlacement={popoverPlacementProps}
                    />
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default SendingListItem;
