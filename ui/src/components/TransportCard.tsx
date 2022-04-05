import React from "react";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import arrowRight from "../theme/icons/arrow-right.svg";
import { DATE_TIME_FORMAT_MIN, TIME_FORMAT_MIN, TransportStatus } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { getNextPlannedSupervisionTime } from "../utils/supervisionUtil";
import "./TransportCard.css";

interface TransportCardProps {
  transport: IRouteTransport;
}

const TransportCard = ({ transport }: TransportCardProps): JSX.Element => {
  const { t } = useTranslation();

  const { id: routeTransportId, currentStatus, departureTime, plannedDepartureTime, route, supervisions = [] } = transport || {};

  const { permit, name: routeName } = route || {};
  const { permitNumber } = permit || {};

  const { status } = currentStatus || {};
  const transportDeparted = status && status !== TransportStatus.PLANNED;

  const nextSupervisionTime = getNextPlannedSupervisionTime(supervisions);

  return (
    <IonItem
      className={`itemIcon iconLink ion-margin-horizontal quarter-margin-bottom ${transportDeparted ? "departedTransport" : ""}`}
      lines="full"
      color={transportDeparted ? undefined : "light"}
      detail
      detailIcon={arrowRight}
      routerLink={`/routetransportdetail/${routeTransportId}`}
    >
      <IonLabel>
        <IonLabel className={transportDeparted ? "headingText" : "headingText upcomingTransport"}>
          <Moment format={DATE_TIME_FORMAT_MIN}>{transportDeparted ? departureTime : plannedDepartureTime}</Moment>
        </IonLabel>
        <IonLabel>
          <small>{routeName}</small>
        </IonLabel>
        <IonLabel>
          <small>{`${t("companyTransports.transportPermit")} ${permitNumber}`}</small>
        </IonLabel>
        {nextSupervisionTime && (
          <IonLabel>
            <small>
              <IonText>{`${t("companyTransports.nextSupervision")} `}</IonText>
              <Moment format={TIME_FORMAT_MIN}>{nextSupervisionTime}</Moment>
              <IonText>{` (${t("companyTransports.estimate")})`}</IonText>
            </small>
          </IonLabel>
        )}
      </IonLabel>
    </IonItem>
  );
};

export default TransportCard;
