import React from "react";
import Moment from "react-moment";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import arrowRight from "../theme/icons/arrow-right.svg";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import ISupervision from "../interfaces/ISupervision";
import { useTranslation } from "react-i18next";
import IRouteTransport from "../interfaces/IRouteTransport";

interface BridgeCardProps {
  supervision: ISupervision;
  routeTransport?: IRouteTransport;
}

const BridgeCard = ({ supervision, routeTransport }: BridgeCardProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: supervisionId, plannedTime, routeBridge } = supervision || {};
  const { bridge } = routeBridge || {};
  const { identifier, name } = bridge || {};
  const { tractorUnit = "" } = routeTransport || {};
  const tractorUnitMissing = `(${t("bridgeCard.tractorUnitMissing")})`;

  return (
    <IonItem className="itemIcon" detail detailIcon={arrowRight} routerLink={`/bridgedetail/${supervisionId}`}>
      <IonLabel>
        <IonLabel className="headingText">{name}</IonLabel>
        <IonLabel>
          <small>{identifier}</small>
        </IonLabel>
        <IonLabel>
          <small>
            <Moment format={DATE_TIME_FORMAT_MIN}>{plannedTime}</Moment>
            {routeTransport && <IonText>{` | ${t("bridgeCard.tractorUnit")} ${tractorUnit ? tractorUnit : tractorUnitMissing}`}</IonText>}
          </small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default BridgeCard;
