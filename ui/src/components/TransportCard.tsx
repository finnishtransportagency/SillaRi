import React from "react";
import { IonGrid, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../utils/constants";
import { useTranslation } from "react-i18next";

interface TransportCardProps {
  transport: IRouteTransport;
}

const TransportCard = ({ transport }: TransportCardProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeTransportId, currentStatus, departureTime, plannedDepartureTime, route } = transport || {};

  const { departureAddress, arrivalAddress, permit } = route || {};
  const { streetAddress: departureStreetAddress } = departureAddress || {};
  const { streetAddress: arrivalStreetAddress } = arrivalAddress || {};
  const { permitNumber } = permit || {};

  const { status } = currentStatus || {};
  const transportDeparted = status && status !== TransportStatus.PLANNED;

  return (
    <IonItem detail routerLink={`/routetransportdetail/${routeTransportId}`}>
      <IonGrid className="ion-no-padding">
        <IonRow>
          <IonLabel>
            <Moment format={DATE_TIME_FORMAT_MIN}>{transportDeparted ? departureTime : plannedDepartureTime}</Moment>
            {!transportDeparted && <IonText>{` (${t("company.transport.estimatedDepartureTime")})`}</IonText>}
          </IonLabel>
        </IonRow>
        <IonRow>
          <IonLabel>
            <small>{departureStreetAddress}</small>
          </IonLabel>
        </IonRow>
        <IonRow>
          <IonLabel>
            <small>{arrivalStreetAddress}</small>
          </IonLabel>
        </IonRow>
        <IonRow>
          <IonLabel>
            <small>{`${t("company.transportPermit")} ${permitNumber}`}</small>
          </IonLabel>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default TransportCard;
