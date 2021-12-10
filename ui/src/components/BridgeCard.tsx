import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import arrowRight from "../theme/icons/arrow-right.svg";
import { SupervisionStatus, TIME_FORMAT_MIN } from "../utils/constants";
import ISupervision from "../interfaces/ISupervision";
import { useTranslation } from "react-i18next";
import IRouteTransport from "../interfaces/IRouteTransport";

interface BridgeCardProps {
  supervision: ISupervision;
  routeTransport?: IRouteTransport;
}

const BridgeCard = ({ supervision, routeTransport }: BridgeCardProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: supervisionId, currentStatus, startedTime, plannedTime, routeBridge } = supervision || {};
  const { status: supervisionStatus } = currentStatus || {};
  const statusPlanned = supervisionStatus === SupervisionStatus.PLANNED;
  const { bridge } = routeBridge || {};
  const { identifier, name, municipality } = bridge || {};
  const { tractorUnit = "" } = routeTransport || {};
  const tractorUnitMissing = `(${t("bridgeCard.tractorUnitMissing")})`;

  return (
    <IonItem className="itemIcon iconLink" detail detailIcon={arrowRight} routerLink={`/bridgedetail/${supervisionId}`}>
      <IonLabel>
        <IonLabel className="headingText">
          <Moment format={TIME_FORMAT_MIN}>{statusPlanned ? plannedTime : startedTime}</Moment>
          {statusPlanned && <IonText>{` (${t("bridgeCard.estimate")})`}</IonText>}
        </IonLabel>
        <IonLabel className="headingText">{name}</IonLabel>
        <IonLabel>
          <small>
            {`${identifier}, ${municipality}`}
            {routeTransport && <IonText>{` | ${t("bridgeCard.tractorUnit")} ${tractorUnit ? tractorUnit : tractorUnitMissing}`}</IonText>}
          </small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
