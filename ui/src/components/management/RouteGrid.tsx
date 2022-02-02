import React, { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText, useIonPopover } from "@ionic/react";
import { warningOutline } from "ionicons/icons";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import { actions } from "../../store/rootSlice";
import close from "../../theme/icons/close.svg";
import { onRetry } from "../../utils/backendData";
import { getRouteTransportsOfPermit } from "../../utils/managementBackendData";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import { isTransportEditable } from "../../utils/validation";
import RouteStatusLog from "./RouteStatusLog";
import "./RouteGrid.css";

interface RouteGridProps {
  permit: IPermit;
  transportFilter: string;
}

const RouteGrid = ({ permit, transportFilter }: RouteGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [isStatusLogOpen, setStatusLogOpen] = useState<boolean>(false);
  const [statusLog, setStatusLog] = useState<IRouteTransportStatus[]>([]);

  const [popoverText, setPopoverText] = useState("");
  const [presentPassword, dismissPassword] = useIonPopover(
    <IonGrid className="ion-no-margin">
      <IonRow className="ion-align-items-center">
        <IonCol size="9" className="ion-text-center">
          <IonText>{popoverText}</IonText>
        </IonCol>
        <IonCol size="3">
          <IonButton
            fill="clear"
            size="small"
            onClick={() => {
              setPopoverText("");
              dismissPassword();
            }}
          >
            <IonIcon className="otherIcon" icon={close} />
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>,
    {
      onHide: () => {
        setPopoverText("");
        dismissPassword();
      },
    }
  );

  const { id: permitId } = permit;

  const { data: routeTransportList } = useQuery(
    ["getRouteTransportsOfPermit", permitId],
    () => getRouteTransportsOfPermit(Number(permitId), dispatch),
    {
      retry: onRetry,
    }
  );

  const timePeriodText = (status?: TransportStatus, statusHistory?: IRouteTransportStatus[]) => {
    if (status && statusHistory && statusHistory.length > 0) {
      const sortedTimes = statusHistory
        .filter((history) => {
          return statusHistory.length === 1 || history.status !== TransportStatus.PLANNED;
        })
        .sort((a, b) => {
          const am = moment(a.time);
          const bm = moment(b.time);
          return bm.diff(am, "seconds");
        });

      switch (status) {
        case TransportStatus.PLANNED: {
          const plannedTime = moment(sortedTimes[0].time);
          return `${t("management.companySummary.time.plannedTime")} ${plannedTime.format(DATE_TIME_FORMAT_MIN)}`;
        }
        case TransportStatus.DEPARTED:
        case TransportStatus.STOPPED:
        case TransportStatus.IN_PROGRESS: {
          const departureTime = moment(sortedTimes[0].time);
          return `${t("management.companySummary.time.departureTime")} ${departureTime.format(DATE_TIME_FORMAT_MIN)}`;
        }
        case TransportStatus.ARRIVED: {
          const arrivalTime = moment(sortedTimes[0].time);
          const departureTime = moment(sortedTimes[sortedTimes.length - 1].time);
          return `${departureTime.format(DATE_TIME_FORMAT_MIN)} - ${arrivalTime.format(DATE_TIME_FORMAT_MIN)}`;
        }
      }
    } else {
      return "";
    }
  };

  const showPassword = (evt: MouseEvent, password?: string) => {
    if (password) {
      setPopoverText(password);
      presentPassword({
        event: evt.nativeEvent,
      });
    }
  };

  const showStatusLog = (isOpen: boolean, statusHistory?: IRouteTransportStatus[]) => {
    setStatusLog(statusHistory || []);
    setStatusLogOpen(isOpen);
  };

  return (
    <IonGrid className="routeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.tractorUnit").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="24" size-lg="8" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.route").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="24" size-lg="4" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.time").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.password").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.status").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
          <IonText>{t("management.companySummary.route.action").toUpperCase()}</IonText>
        </IonCol>
      </IonRow>

      {routeTransportList &&
        routeTransportList
          .filter((routeTransport) => {
            const { currentStatus } = routeTransport;
            const { status } = currentStatus || {};

            switch (transportFilter) {
              case "planned": {
                return status === TransportStatus.PLANNED;
              }
              case "in_progress": {
                return status === TransportStatus.DEPARTED || status === TransportStatus.STOPPED || status === TransportStatus.IN_PROGRESS;
              }
              case "completed": {
                return status === TransportStatus.ARRIVED;
              }
              default: {
                return true;
              }
            }
          })
          /*
          .sort((a, b) => {
            const am = moment(a.plannedDepartureTime);
            const bm = moment(b.plannedDepartureTime);
            return bm.diff(am, "seconds");
          })
          */
          .sort((a, b) => b.id - a.id)
          .map((routeTransport, index) => {
            const key = `routetransport_${index}`;
            const {
              id: routeTransportId,
              tractorUnit,
              currentTransportPassword,
              currentStatus,
              statusHistory = [],
              route,
              supervisions,
            } = routeTransport;
            const { name: routeName } = route || {};
            const { transportPassword } = currentTransportPassword || {};
            const { status } = currentStatus || {};

            const statusText = status ? t(`management.transportStatus.${status.toLowerCase()}`) : t("management.transportStatus.unknown");
            const action = isTransportEditable(routeTransport, permit)
              ? t("management.companySummary.action.modify")
              : t("management.companySummary.action.details");

            return (
              <IonRow key={key}>
                <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonText className="headingText ion-hide-lg-up">{`${t("management.companySummary.route.tractorUnit")}: `}</IonText>
                  <IonText>{tractorUnit ? tractorUnit.toUpperCase() : ""}</IonText>
                </IonCol>

                <IonCol size="24" size-lg="8" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonGrid className="routeSubGrid ion-no-padding">
                    <IonRow>
                      <IonCol size="12" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.route")}</IonText>
                      </IonCol>
                      <IonCol size="12">
                        <IonText>{routeName}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="24" size-lg="4" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonGrid className="routeSubGrid ion-no-padding">
                    <IonRow>
                      <IonCol size="12" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.time")}</IonText>
                      </IonCol>
                      <IonCol size="12">
                        <IonText>{timePeriodText(status, statusHistory)}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonGrid className="routeSubGrid ion-no-padding">
                    <IonRow>
                      <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.password")}</IonText>
                      </IonCol>
                      <IonCol size="7" size-sm="9" size-lg="12">
                        {transportPassword && transportPassword.length > 0 ? (
                          <IonText className="linkText" onClick={(evt) => showPassword(evt, transportPassword)}>
                            {t("management.companySummary.action.show")}
                          </IonText>
                        ) : (
                          <IonText>{`(${t("management.transportDetail.passwordUnknown")})`}</IonText>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonGrid className="routeSubGrid ion-no-padding">
                    <IonRow>
                      <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.status")}</IonText>
                      </IonCol>
                      <IonCol size="7" size-sm="9" size-lg="12">
                        {status !== TransportStatus.PLANNED && (
                          <IonText
                            className={`linkText routeGridStatus routeGridStatus_${status?.toLowerCase()}`}
                            onClick={() => showStatusLog(true, statusHistory)}
                          >
                            {statusText}
                          </IonText>
                        )}

                        {status === TransportStatus.PLANNED && (!supervisions || supervisions.length === 0) && (
                          <>
                            <IonIcon className="routeGridStatusUnknown" icon={warningOutline} />
                            <IonText className="routeGridStatusUnknown">{t("management.transportStatus.unknown")}</IonText>
                          </>
                        )}
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="24" size-lg="3" className="ion-padding-start ion-padding-top ion-padding-bottom">
                  <IonGrid className="routeSubGrid ion-no-padding">
                    <IonRow>
                      <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.action")}</IonText>
                      </IonCol>
                      <IonCol size="7" size-sm="9" size-lg="12">
                        <Link
                          to={`/management/transportDetail/${routeTransportId}`}
                          onClick={() => {
                            dispatch({ type: actions.SET_MANAGEMENT_PERMIT_ID, payload: permitId });
                          }}
                        >
                          <IonText className="linkText">{action}</IonText>
                        </Link>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            );
          })}

      <RouteStatusLog isOpen={isStatusLogOpen} setOpen={setStatusLogOpen} statusHistory={statusLog} />
    </IonGrid>
  );
};

export default RouteGrid;
