import React from "react";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonLabel, IonRow, IonText } from "@ionic/react";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import { DATE_FORMAT, TIME_FORMAT_MIN, TransportStatus } from "../utils/constants";
import { useTranslation } from "react-i18next";
import { getNextPlannedSupervisionTime } from "../utils/supervisionUtil";
import "./TransportCard.css";
import lock from "../theme/icons/lock_closed_white.svg";

interface TransportCardProps {
  transport: IRouteTransport;
}

const TransportCard = ({ transport }: TransportCardProps): JSX.Element => {
  const { t } = useTranslation();

  const {
    id: routeTransportId,
    currentStatus,
    departureTime,
    plannedDepartureTime,
    tractorUnit = "",
    transportNumber,
    route,
    supervisions = [],
  } = transport || {};

  const { permit, name: routeName } = route || {};
  const { permitNumber } = permit || {};

  const { status } = currentStatus || {};
  const transportDeparted = status && status !== TransportStatus.PLANNED;

  const nextSupervisionTime = getNextPlannedSupervisionTime(supervisions);

  return (
    <IonItem
      className={`ion-margin-horizontal quarter-margin-bottom ${transportDeparted ? "departedTransport" : ""}`}
      lines="full"
      color={transportDeparted ? undefined : "light"}
      routerLink={`/routetransportdetail/${routeTransportId}`}
    >
      <IonGrid className="ion-no-margin ion-no-padding">
        <IonRow className="ion-margin-vertical ion-align-items-center ion-justify-content-between">
          <IonCol size="10">
            <IonLabel color={transportDeparted ? undefined : "dark"}>
              <IonLabel className={transportDeparted ? "headingText" : "headingText upcomingTransport"}>
                <Moment format={DATE_FORMAT}>{transportDeparted ? departureTime : plannedDepartureTime}</Moment>
                <IonText>{tractorUnit ? ` | ${tractorUnit.toUpperCase()}` : ""}</IonText>
              </IonLabel>
              <IonLabel>
                <small>{routeName}</small>
              </IonLabel>
              <IonLabel>
                <small>{`${t("companyTransports.transportPermit")} ${permitNumber}`}</small>
                {transportNumber && <small>{` | ${t("companyTransports.transportNumber")}: ${transportNumber}`}</small>}
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
          </IonCol>
          <IonCol size="auto">
            <IonButton
              size="default"
              color="secondary"
              className="passwordButton"
              onClick={() => {
                console.log("Password button clicked");
              }}
            >
              <IonIcon className="otherIcon" icon={lock} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonItem>
  );
};

export default TransportCard;
