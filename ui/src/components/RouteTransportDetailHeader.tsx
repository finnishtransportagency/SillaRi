import React from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonLabel, IonRow } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import file from "../theme/icons/file.svg";
import IRouteTransport from "../interfaces/IRouteTransport";
import Moment from "react-moment";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";

interface RouteTransportDetailHeaderProps {
  routeTransport: IRouteTransport;
  permit: IPermit;
}

const RouteTransportDetailHeader = ({ routeTransport, permit }: RouteTransportDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { tractorUnit = "", departureTime, plannedDepartureTime } = routeTransport || {};
  const { permitNumber } = permit || {};

  return (
    <IonGrid className="ion-no-padding lightBackground">
      <IonRow className="ion-padding ion-align-items-center">
        <IonCol size-md="3" size-lg="2">
          <IonLabel className="headingText">{departureTime ? t("route.departureTime") : t("route.plannedTime")}</IonLabel>
        </IonCol>
        <IonCol>
          <Moment format={DATE_TIME_FORMAT_MIN}>{departureTime ? departureTime : plannedDepartureTime}</Moment>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding ion-align-items-center">
        <IonCol size-md="3" size-lg="2">
          <IonLabel className="headingText">{t("route.tractorUnit")}</IonLabel>
        </IonCol>
        <IonCol>
          <IonLabel>{tractorUnit}</IonLabel>
        </IonCol>
      </IonRow>
      <IonRow className="ion-padding ion-align-items-center">
        <IonCol size-md="3" size-lg="2">
          <IonLabel className="headingText">{t("route.transportPermit")}</IonLabel>
        </IonCol>
        <IonCol>
          <IonRow className="ion-align-items-center">
            <IonCol size="auto">
              <IonIcon className="otherIcon" icon={file} />
            </IonCol>
            <IonCol>
              <IonLabel>{`${permitNumber} (pdf)`}</IonLabel>
            </IonCol>
          </IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RouteTransportDetailHeader;
