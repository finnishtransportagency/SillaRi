import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import { DATE_TIME_FORMAT_MIN, SupervisionListType, SupervisionStatus, TIME_FORMAT_MIN } from "../utils/constants";
import { getPasswordFromStorage } from "../utils/trasportCodeStorageUtil";
import ISupervision from "../interfaces/ISupervision";
import { useTranslation } from "react-i18next";
import IRouteTransport from "../interfaces/IRouteTransport";
import { useHistory } from "react-router-dom";
import { actions } from "../store/rootSlice";
import { useDispatch } from "react-redux";
import lock from "../theme/icons/lock_closed_white.svg";
import arrowRight from "../theme/icons/arrow-right.svg";
import SupervisionPasswordPopover from "./SupervisionPasswordPopover";
import moment from "moment";

interface BridgeCardProps {
  username: string;
  routeTransport: IRouteTransport;
  supervision: ISupervision;
  supervisionListType: string;
  isOnline: boolean;
}

const BridgeCard = ({ username, routeTransport, supervision, supervisionListType, isOnline }: BridgeCardProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [passwordPopoverOpen, setPasswordPopoverOpen] = useState<boolean>(false);
  const [supervisionUnlocked, setSupervisionUnlocked] = useState<boolean>(false);

  const { id: supervisionId, currentStatus, startedTime, plannedTime, routeBridge } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const statusPlanned = supervisionStatus === SupervisionStatus.PLANNED || supervisionStatus === SupervisionStatus.CANCELLED;
  const { bridge } = routeBridge || {};
  const { identifier, name, municipality } = bridge || {};
  const { id: routeTransportId = 0, tractorUnit = "" } = routeTransport || {};
  const tractorUnitMissing = `(${t("bridgeCard.tractorUnitMissing")})`;

  // TODO how else can we check if supervision is locked or not at this point?
  /*Supervisions are listed from getSupervisionList (/getsupervisionsofsupervisor) which fetches all supervisions for user's company,
  so there's no way of sending supervisionIds and passwords in this call
  If this is not enough at this point, we would need to use /getSupervision for each supervision on the list (which could be A LOT)
  or create a separate call to backend with all supervisionIds and their passwords from storage*/
  useEffect(() => {
    // Must set supervisionUnlocked inside useEffect, since Storage returns a promise
    if (username) {
      getPasswordFromStorage(username, SupervisionListType.BRIDGE, supervisionId).then((result) => {
        if (result) {
          setSupervisionUnlocked(true);
        }
      });
    }
  }, [username, supervisionId]);

  // Trigger id determines the placement and size of the password popover
  const passwordPopoverTriggerId = `passwordTrigger_supervision_${supervisionId}`;
  const supervisionTime = statusPlanned ? plannedTime : startedTime;
  const passwordTitle = `${moment(supervisionTime).format(DATE_TIME_FORMAT_MIN)} ${name}`;

  const navigateToBridgeDetail = () => {
    dispatch({ type: actions.SET_SUPERVISION_LIST_TYPE, payload: supervisionListType });
    history.push(`/bridgedetail/${supervisionId}`);
  };

  return (
    <IonItem className="small-margin-bottom" lines="full">
      <IonGrid className="ion-no-margin ion-no-padding">
        <IonRow id={passwordPopoverTriggerId} className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
          <IonCol size="9">
            <IonLabel>
              <IonLabel className="headingText">
                <Moment format={TIME_FORMAT_MIN}>{supervisionTime}</Moment>
                {statusPlanned && <IonText>{` (${t("bridgeCard.estimate")})`}</IonText>}
              </IonLabel>
              <IonLabel className="headingText">{name}</IonLabel>
              <IonLabel>
                <small>
                  {`${identifier}, ${municipality}`}
                  {routeTransport && (
                    <IonText>{` | ${t("bridgeCard.tractorUnit")} ${tractorUnit ? tractorUnit.toUpperCase() : tractorUnitMissing}`}</IonText>
                  )}
                </small>
              </IonLabel>
            </IonLabel>
          </IonCol>
          <IonCol size="auto">
            {supervisionUnlocked ? (
              <IonButton
                size="default"
                fill="clear"
                onClick={() => {
                  navigateToBridgeDetail();
                }}
              >
                <IonIcon className="otherIcon" icon={arrowRight} />
              </IonButton>
            ) : (
              <IonButton
                size="default"
                color="secondary"
                className="passwordButton"
                disabled={!isOnline}
                onClick={() => {
                  setPasswordPopoverOpen(true);
                }}
              >
                <IonIcon className="otherIcon" icon={lock} />
              </IonButton>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
      {!supervisionUnlocked && (
        <SupervisionPasswordPopover
          triggerId={passwordPopoverTriggerId}
          title={passwordTitle}
          isOpen={passwordPopoverOpen}
          setOpen={setPasswordPopoverOpen}
          routeTransportId={routeTransportId}
          supervisions={[supervision]}
          supervisionListType={SupervisionListType.BRIDGE}
          openSupervision={navigateToBridgeDetail}
        />
      )}
    </IonItem>
  );
};

export default BridgeCard;
