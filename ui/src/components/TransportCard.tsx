import React from "react";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import arrowRight from "../theme/icons/arrow-right.svg";
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
    <IonItem className="itemIcon" detail detailIcon={arrowRight} routerLink={`/routetransportdetail/${routeTransportId}`}>
      <IonLabel>
        <IonLabel className="headingText">
          <Moment format={DATE_TIME_FORMAT_MIN}>{transportDeparted ? departureTime : plannedDepartureTime}</Moment>
          {!transportDeparted && <IonText>{` (${t("company.transport.estimatedDepartureTime")})`}</IonText>}
        </IonLabel>
        <IonLabel>
          <small>{departureStreetAddress}</small>
        </IonLabel>
        <IonLabel>
          <small>{arrivalStreetAddress}</small>
        </IonLabel>
        <IonLabel>
          <small>{`${t("company.transportPermit")} ${permitNumber}`}</small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default TransportCard;
