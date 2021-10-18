import React from "react";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../utils/constants";
import { useTranslation } from "react-i18next";

interface TransportCardProps {
  transport: IRouteTransport;
}

const TransportCard = ({ transport }: TransportCardProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeTransportId, currentStatus, departureTime, plannedDepartureTime } = transport || {};
  const { status } = currentStatus || {};
  const transportDeparted = status && status !== TransportStatus.PLANNED;

  return (
    <IonItem detail routerLink={`/routetransportdetail/${routeTransportId}`}>
      <IonLabel>
        <Moment format={DATE_TIME_FORMAT_MIN}>{transportDeparted ? departureTime : plannedDepartureTime}</Moment>
        {!transportDeparted && <IonText>{` (${t("company.transport.estimatedDepartureTime")})`}</IonText>}
      </IonLabel>
    </IonItem>
  );
};

export default TransportCard;
