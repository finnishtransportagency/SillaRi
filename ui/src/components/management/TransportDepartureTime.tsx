import React, { Dispatch, MouseEvent, SetStateAction } from "react";
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
import moment from "moment";
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
  const estimatedDeparture = plannedDepartureTime ? moment(plannedDepartureTime) : moment();

  const closeModal = (evt: MouseEvent) => {
    evt.stopPropagation();
    setOpen(false);
  };

  const setPlannedDepartureDate = (dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = modifiedRouteTransportDetail.plannedDepartureTime;
      /*dt.setFullYear(dateTime.getFullYear());
      dt.setMonth(dateTime.getMonth());
      dt.setDate(dateTime.getDate());*/
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: dt };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setPlannedDepartureTime = (dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const dt = modifiedRouteTransportDetail.plannedDepartureTime;
      /*dt.setHours(dateTime.getHours());
      dt.setMinutes(dateTime.getMinutes());
      dt.setSeconds(0);*/
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: dt };
      setModifiedRouteTransportDetail(newDetail);
    }
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
                    <DatePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureDate} />
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
                    <TimePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />
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
            <IonButton color="secondary" expand="block" onClick={() => setOpen(false)}>
              {t("common.buttons.cancel")}
            </IonButton>
            <IonButton color="primary" expand="block" onClick={() => setOpen(false)}>
              {t("management.transportDetail.transportDepartureTime.setTime")}
            </IonButton>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default TransportDepartureTime;
