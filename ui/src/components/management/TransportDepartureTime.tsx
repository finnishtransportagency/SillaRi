import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRouteTransport from "../../interfaces/IRouteTransport";
import close from "../../theme/icons/close_large.svg";
import infoOutline from "../../theme/icons/info-outline.svg";

interface TransportDepartureTimeProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
}

const TransportDepartureTime = ({
  isOpen,
  setOpen,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
}: TransportDepartureTimeProps): JSX.Element => {
  const { t } = useTranslation();

  const { plannedDepartureTime } = modifiedRouteTransportDetail || {};
  const estimatedDeparture = plannedDepartureTime ? plannedDepartureTime : new Date();
  const [departureTime, setDepartureTime] = useState<Date>(estimatedDeparture);

  const setPlannedDepartureDate = (dateTime: Date) => {
    const dt = new Date(departureTime);
    dt.setFullYear(dateTime.getFullYear());
    dt.setMonth(dateTime.getMonth());
    dt.setDate(dateTime.getDate());
    // TODO validation
    setDepartureTime(dt);
  };

  const setPlannedDepartureTime = (dateTime: Date) => {
    const dt = new Date(departureTime);
    dt.setHours(dateTime.getHours());
    dt.setMinutes(dateTime.getMinutes());
    dt.setSeconds(0);
    // TODO validation
    setDepartureTime(dt);
  };

  const closeModal = (evt: MouseEvent) => {
    evt.stopPropagation();
    setOpen(false);
    setDepartureTime(estimatedDeparture);
  };

  const updatePlannedDeparture = (evt: MouseEvent) => {
    evt.stopPropagation();
    const newRouteTransport: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: departureTime };
    setModifiedRouteTransportDetail(newRouteTransport);
    setOpen(false);
  };

  return (
    <IonContent>
      <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonTitle className="headingText">{t("management.transportDetail.transportDepartureTime.header")}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={(evt) => closeModal(evt as MouseEvent)}>
                <IonIcon className="otherIconLarge" icon={close} color="primary" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonGrid className="ion-no-padding ion-margin">
          <IonRow className="ion-margin-top">
            <IonCol className="ion-padding-end">
              <IonLabel className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureDate")}</IonLabel>
              <DatePicker value={departureTime} onChange={setPlannedDepartureDate} />
            </IonCol>
            <IonCol>
              <IonLabel className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureTime")}</IonLabel>
              <TimePicker value={departureTime} onChange={setPlannedDepartureTime} />
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top">
            <IonCol>
              <IonItem className="ion-no-padding" lines="none">
                <IonIcon className="otherIcon" icon={infoOutline} slot="start" />
                <IonLabel className="itemLabel">{t("management.transportDetail.transportDepartureTime.info")}</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top ion-justify-content-end">
            <IonCol className="ion-padding-end" size-lg="3">
              <IonButton color="secondary" expand="block" onClick={(evt) => closeModal(evt)}>
                {t("common.buttons.cancel")}
              </IonButton>
            </IonCol>
            <IonCol size-lg="4">
              {/*TODO disabled when date validation fails*/}
              <IonButton color="primary" expand="block" onClick={(evt) => updatePlannedDeparture(evt)}>
                {t("management.transportDetail.transportDepartureTime.setTime")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonModal>
    </IonContent>
  );
};

export default TransportDepartureTime;
