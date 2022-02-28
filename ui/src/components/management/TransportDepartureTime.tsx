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
  IonText,
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
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle class="headingText">{t("management.transportDetail.transportDepartureTime.header")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(evt) => closeModal(evt as MouseEvent)}>
              <IonIcon className="otherIconLarge" icon={close} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid className="ion-no-padding ion-margin">
          <IonRow>
            <IonCol>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-top">
                  <IonCol>
                    <IonText className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureDate")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <DatePicker value={departureTime} onChange={setPlannedDepartureDate} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>

            <IonCol>
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin-start ion-margin-end ion-margin-top">
                  <IonCol>
                    <IonText className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureTime")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin-start ion-margin-end">
                  <IonCol>
                    <TimePicker value={departureTime} onChange={setPlannedDepartureTime} />
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonItem lines="none">
              <IonIcon className="otherIcon" icon={infoOutline} slot="start" />
              <IonLabel className="itemLabel">{t("management.transportDetail.transportDepartureTime.info")}</IonLabel>
            </IonItem>
          </IonRow>
          <IonRow>
            <IonButton color="secondary" expand="block" onClick={(evt) => closeModal(evt)}>
              {t("common.buttons.cancel")}
            </IonButton>
            {/*TODO disabled when date validation fails*/}
            <IonButton color="primary" expand="block" onClick={(evt) => updatePlannedDeparture(evt)}>
              {t("management.transportDetail.transportDepartureTime.setTime")}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default TransportDepartureTime;
