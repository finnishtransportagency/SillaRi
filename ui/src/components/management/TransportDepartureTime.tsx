import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRouteTransport from "../../interfaces/IRouteTransport";

interface TransportDepartureTimeProps {
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
}

const TransportDepartureTime = ({ modifiedRouteTransportDetail, setModifiedRouteTransportDetail }: TransportDepartureTimeProps): JSX.Element => {
  const { t } = useTranslation();

  const { plannedDepartureTime } = modifiedRouteTransportDetail || {};

  const estimatedDeparture = moment(plannedDepartureTime);

  const setPlannedDepartureDate = (dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = modifiedRouteTransportDetail.plannedDepartureTime;
      dt.setFullYear(dateTime.getFullYear());
      dt.setMonth(dateTime.getMonth());
      dt.setDate(dateTime.getDate());
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: dt };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setPlannedDepartureTime = (dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = modifiedRouteTransportDetail.plannedDepartureTime;
      dt.setHours(dateTime.getHours());
      dt.setMinutes(dateTime.getMinutes());
      dt.setSeconds(0);
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: dt };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size-lg="2">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.estimatedDepartureDate")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <DatePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureDate} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size-lg="2">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-start ion-margin-end ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.estimatedDepartureTime")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end">
              <IonCol>
                <TimePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TransportDepartureTime;
