import React, { Dispatch, Fragment, MouseEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import moment from "moment";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import checkBlack from "../../theme/icons/check_black.svg";
import checkWhite from "../../theme/icons/check_white.svg";
import close from "../../theme/icons/close_large_white.svg";
import truckBlack from "../../theme/icons/truck_black.svg";
import truckWhite from "../../theme/icons/truck_white.svg";
import upBlack from "../../theme/icons/up_black.svg";
import upWhite from "../../theme/icons/up_white.svg";
import { DATE_FORMAT, TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import "./RouteStatusLog.css";

interface RouteStatusLogProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  statusHistory: IRouteTransportStatus[];
}

const RouteStatusLog = ({ isOpen, setOpen, statusHistory }: RouteStatusLogProps): JSX.Element => {
  const { t } = useTranslation();

  const closeStatusLog = (evt: MouseEvent) => {
    evt.stopPropagation();
    setOpen(false);
  };

  // Use matchMedia to check the user preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const darkMode = prefersDark.matches;

  return (
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("management.companySummary.transportStatusLog")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(evt) => closeStatusLog(evt as MouseEvent)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonGrid className="ion-no-padding ion-margin">
          {statusHistory
            .filter((statusLog) => {
              return statusHistory.length === 1 || statusLog.status !== TransportStatus.PLANNED;
            })
            .sort((a, b) => {
              const am = moment(a.time);
              const bm = moment(b.time);
              return bm.diff(am, "seconds");
            })
            .map((statusLog, index, history) => {
              const { status, time } = statusLog;
              const timeMoment = moment(time);
              const prevStatus = index > 0 ? history[index - 1] : undefined;
              const nextStatus = index < history.length - 1 ? history[index + 1] : undefined;
              const { time: prevTime } = prevStatus || {};
              const { time: nextTime } = nextStatus || {};
              const key = `statuslog_${index}`;

              return (
                <Fragment key={key}>
                  <IonRow className="ion-align-items-center">
                    <IonCol size="3" className="ion-text-center">
                      <IonText>
                        {index === 0 && <IonIcon className="logIconLarge" icon={darkMode ? truckWhite : truckBlack} />}
                        {index > 0 && index < history.length - 1 && <IonIcon className="logIcon" icon={darkMode ? checkWhite : checkBlack} />}
                        {index > 0 && index === history.length - 1 && <IonIcon className="logIcon" icon={darkMode ? upWhite : upBlack} />}
                      </IonText>
                    </IonCol>
                    <IonCol size="3">
                      <IonGrid className="ion-no-padding">
                        <IonRow>
                          <IonCol>
                            <IonText className="headingBoldText">{timeMoment.format(TIME_FORMAT_MIN)}</IonText>
                          </IonCol>
                        </IonRow>
                        {(!prevTime ||
                          !moment(prevTime).isSame(timeMoment, "day") ||
                          !moment(nextTime).isSame(timeMoment, "day") ||
                          index === history.length - 1) && (
                          <IonRow>
                            <IonCol>
                              <small>
                                <IonText>{timeMoment.format(DATE_FORMAT)}</IonText>
                              </small>
                            </IonCol>
                          </IonRow>
                        )}
                      </IonGrid>
                    </IonCol>
                    <IonCol size="6">
                      <IonText>{t(`management.companySummary.logStatus.${status.toLowerCase()}`)}</IonText>
                    </IonCol>
                  </IonRow>

                  {index < history.length - 1 && (
                    <IonRow className="ion-align-items-center">
                      <IonCol size="3" className="ion-text-center">
                        <IonText className="verticalLine"></IonText>
                      </IonCol>
                    </IonRow>
                  )}
                </Fragment>
              );
            })}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default RouteStatusLog;
