import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import Moment from "react-moment";
import PermitLinkItem from "../components/PermitLinkItem";
import IPermit from "../interfaces/IPermit";
import IRouteTransport from "../interfaces/IRouteTransport";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";

interface RouteTransportDetailHeaderProps {
  routeTransport: IRouteTransport;
  permit: IPermit;
}

const RouteTransportDetailHeader = ({ routeTransport, permit }: RouteTransportDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { tractorUnit = "", departureTime, plannedDepartureTime } = routeTransport || {};

  return (
    <>
      <IonItem className="header itemIcon" detail detailIcon="" lines="none">
        <IonLabel className="headingText">{departureTime ? t("route.departureTime") : t("route.plannedTime")}</IonLabel>
        <IonLabel>
          <Moment format={DATE_TIME_FORMAT_MIN}>{departureTime ? departureTime : plannedDepartureTime}</Moment>
        </IonLabel>
      </IonItem>
      <IonItem className="header itemIcon" detail detailIcon="" lines="none">
        <IonLabel className="headingText">{t("route.tractorUnit")}</IonLabel>
        <IonLabel>{tractorUnit.toUpperCase()}</IonLabel>
      </IonItem>

      <PermitLinkItem permit={permit} isHeader />
    </>
  );
};

export default RouteTransportDetailHeader;
