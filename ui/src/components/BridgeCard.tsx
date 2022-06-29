import React, { useState } from "react";
import Moment from "react-moment";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import { DATE_TIME_FORMAT_MIN, SupervisionStatus, TIME_FORMAT_MIN } from "../utils/constants";
import ISupervision from "../interfaces/ISupervision";
import { useTranslation } from "react-i18next";
import IRouteTransport from "../interfaces/IRouteTransport";
import { useHistory } from "react-router-dom";
import { actions } from "../store/rootSlice";
import { useDispatch } from "react-redux";
import lock from "../theme/icons/lock_closed_white.svg";
import SupervisionPasswordPopover from "./SupervisionPasswordPopover";
import moment from "moment";

interface BridgeCardProps {
  routeTransport: IRouteTransport;
  supervision: ISupervision;
  supervisionListType: string;
}

const BridgeCard = ({ routeTransport, supervision, supervisionListType }: BridgeCardProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [passwordPopoverOpen, setPasswordPopoverOpen] = useState<boolean>(false);

  const { id: supervisionId, currentStatus, startedTime, plannedTime, routeBridge } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const statusPlanned = supervisionStatus === SupervisionStatus.PLANNED;
  const { bridge } = routeBridge || {};
  const { identifier, name, municipality } = bridge || {};
  const { id: routeTransportId = 0, tractorUnit = "" } = routeTransport || {};
  const tractorUnitMissing = `(${t("bridgeCard.tractorUnitMissing")})`;

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
          {/*TODO show password button only when supervision is still locked
          If unlocked, show right arrow as before
          Otherwise we have to submit password 2 times when navigating from RouteTransportDetail
          */}
          <IonCol size="auto">
            <IonButton
              size="default"
              color="secondary"
              className="passwordButton"
              onClick={() => {
                setPasswordPopoverOpen(true);
              }}
            >
              <IonIcon className="otherIcon" icon={lock} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <SupervisionPasswordPopover
        triggerId={passwordPopoverTriggerId}
        title={passwordTitle}
        isOpen={passwordPopoverOpen}
        setOpen={setPasswordPopoverOpen}
        routeTransportId={routeTransportId}
        supervisions={[supervision]}
        openSupervision={navigateToBridgeDetail}
      />
    </IonItem>
  );
};

export default BridgeCard;
