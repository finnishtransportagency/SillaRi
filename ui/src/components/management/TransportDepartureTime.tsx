import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
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
import Moment from "react-moment";
import { DATE_FORMAT, TIME_FORMAT_MIN } from "../../utils/constants";
import { isTimestampCurrentOrAfter } from "../../utils/validation";
import ValidationError from "../common/ValidationError";
import ISupervision from "../../interfaces/ISupervision";
import moment from "moment";

interface TransportDepartureTimeProps {
  isEditable: boolean;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
}

const TransportDepartureTime = ({
  isEditable,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
}: TransportDepartureTimeProps): JSX.Element => {
  const { t } = useTranslation();

  const { plannedDepartureTime, supervisions = [] } = modifiedRouteTransportDetail || {};
  const estimatedDeparture = plannedDepartureTime ? plannedDepartureTime : new Date();

  /*Event is needed for positioning the popup relative to the element which triggered the event*/
  const [popoverState, setShowPopover] = useState<{ showPopover: boolean; event: MouseEvent | undefined }>({ showPopover: false, event: undefined });
  const [departureTime, setDepartureTime] = useState<Date>(estimatedDeparture);
  const [departureTimeValid, setDepartureTimeValid] = useState<boolean>(true);

  const showPopup = (evt: MouseEvent) => {
    evt.persist();
    setShowPopover({ showPopover: true, event: evt });
  };

  const hidePopup = () => {
    setShowPopover({ showPopover: false, event: undefined });
  };

  const setPlannedDepartureDate = (dateTime: Date) => {
    const dt = new Date(departureTime);
    dt.setFullYear(dateTime.getFullYear());
    dt.setMonth(dateTime.getMonth());
    dt.setDate(dateTime.getDate());

    setDepartureTimeValid(isTimestampCurrentOrAfter(dt));
    setDepartureTime(dt);
  };

  const setPlannedDepartureTime = (dateTime: Date) => {
    const dt = new Date(departureTime);
    dt.setHours(dateTime.getHours());
    dt.setMinutes(dateTime.getMinutes());
    dt.setSeconds(0);

    setDepartureTimeValid(isTimestampCurrentOrAfter(dt));
    setDepartureTime(dt);
  };

  const cancelChanges = (evt: MouseEvent) => {
    evt.stopPropagation();
    hidePopup();
    setDepartureTime(plannedDepartureTime ? plannedDepartureTime : new Date());
  };

  const updateSupervisionTimes = (): ISupervision[] => {
    if (supervisions.length > 0) {
      // Compare previous time and selected time, ignore seconds and milliseconds
      const selectedDeparture = moment(departureTime).startOf("minute");
      const previousDeparture = plannedDepartureTime ? moment(plannedDepartureTime).startOf("minute") : null;
      const timeDiff = previousDeparture ? selectedDeparture.diff(previousDeparture, "minutes") : null;
      console.log("diff", timeDiff, "minutes");

      return supervisions.map((s) => {
        const { plannedTime: currentTime } = s;
        if (currentTime && timeDiff !== null) {
          // Update supervision time by diff in previous departure time and new departure time
          return { ...s, plannedTime: moment(currentTime).add(timeDiff, "minutes").toDate() };
        }
        // If plannedDepartureTime was not set before (or supervision is missing plannedTime),
        // update all planned supervision times with new departure time
        return { ...s, plannedTime: moment(departureTime).toDate() };
      });
    }
    return supervisions;
  };

  const updatePlannedDeparture = (evt: MouseEvent) => {
    evt.stopPropagation();

    const updatedSupervisions = updateSupervisionTimes();
    const newRouteTransport: IRouteTransport = {
      ...modifiedRouteTransportDetail,
      plannedDepartureTime: moment(departureTime).toDate(),
      supervisions: updatedSupervisions,
    };
    setModifiedRouteTransportDetail(newRouteTransport);
    hidePopup();
  };

  return (
    <IonCol>
      <IonRow>
        <IonText className="headingText">{t("management.transportDetail.routeInfo.estimatedDepartureTime")}</IonText>
      </IonRow>
      <IonRow>
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-align-items-center">
            {plannedDepartureTime && (
              <IonCol size="12" size-sm="5" size-lg="3">
                <IonText>
                  <Moment format={DATE_FORMAT}>{plannedDepartureTime}</Moment>
                  {` ${t("management.transportDetail.transportDepartureTime.departureAt")} `}
                  <Moment format={TIME_FORMAT_MIN}>{plannedDepartureTime}</Moment>
                </IonText>
              </IonCol>
            )}
            {isEditable && (
              <IonCol size="12" size-sm="6" size-lg="3" className="ion-padding-end">
                <IonButton color="secondary" expand="block" onClick={(evt) => showPopup(evt)}>
                  {!plannedDepartureTime
                    ? t("management.transportDetail.buttons.setDepartureTime")
                    : t("management.transportDetail.buttons.updateDepartureTime")}
                </IonButton>
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </IonRow>
      <IonRow>
        <IonPopover
          className="large-popover"
          isOpen={popoverState.showPopover}
          onDidDismiss={() => hidePopup()}
          event={popoverState.event}
          side={plannedDepartureTime ? "bottom" : "end"}
        >
          <IonHeader className="ion-no-border">
            <IonToolbar color="light">
              <IonTitle className="headingText">{t("management.transportDetail.transportDepartureTime.header")}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={(evt) => cancelChanges(evt as MouseEvent)}>
                  <IonIcon className="otherIconLarge" icon={close} color="primary" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <IonGrid className="ion-no-padding ion-margin">
            <IonRow className="ion-margin-top ion-align-items-end">
              <IonCol className="ion-padding-end">
                <IonLabel className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureDate")}</IonLabel>
                <DatePicker value={departureTime} onChange={setPlannedDepartureDate} usePortal={true} />
              </IonCol>
              <IonCol>
                <IonLabel className="headingText">{t("management.transportDetail.transportDepartureTime.estimatedDepartureTime")}</IonLabel>
                <TimePicker value={departureTime} onChange={setPlannedDepartureTime} hasError={!departureTimeValid} usePortal={true} />
              </IonCol>
            </IonRow>
            {!departureTimeValid && (
              <IonRow className="ion-margin-start">
                <IonCol size="6" offset="6">
                  <ValidationError label={t("common.validation.checkTime")} />
                </IonCol>
              </IonRow>
            )}
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
                <IonButton color="secondary" expand="block" onClick={(evt) => cancelChanges(evt)}>
                  {t("common.buttons.cancel")}
                </IonButton>
              </IonCol>
              <IonCol size-lg="4">
                <IonButton color="primary" expand="block" disabled={!departureTimeValid} onClick={(evt) => updatePlannedDeparture(evt)}>
                  {t("management.transportDetail.transportDepartureTime.setTime")}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonPopover>
      </IonRow>
    </IonCol>
  );
};

export default TransportDepartureTime;
