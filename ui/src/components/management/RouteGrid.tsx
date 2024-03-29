import React, { MouseEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonIcon, IonItem, IonRow, IonText, IonToast, useIonAlert, useIonPopover } from "@ionic/react";
import { warningOutline } from "ionicons/icons";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import { actions } from "../../store/rootSlice";
import close from "../../theme/icons/close.svg";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import { areSupervisionsValid, hasSupervisionStarted, isTransportEditable } from "../../utils/validation";
import RouteStatusLog from "./RouteStatusLog";
import "./RouteGrid.css";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISortOrder from "../../interfaces/ISortOrder";
import { filterTransports, getTransportDepartureTime, sortTransports } from "../../utils/managementUtil";
import { useMutation, useQueryClient } from "react-query";
import { deleteRouteTransport } from "../../utils/managementBackendData";
import IToastMessage from "../../interfaces/IToastMessage";

interface RouteGridProps {
  permit: IPermit;
  routeTransports: IRouteTransport[];
  transportFilter: string;
}

const RouteGrid = ({ permit, routeTransports = [], transportFilter }: RouteGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [present] = useIonAlert();
  const [toastMessage, setToastMessage] = useState<IToastMessage>({ message: "", color: "" });

  const { id: permitId, isCurrentVersion } = permit;

  const [isStatusLogOpen, setStatusLogOpen] = useState<boolean>(false);
  const [statusLog, setStatusLog] = useState<IRouteTransportStatus[]>([]);
  const [sortedTransports, setSortedTransports] = useState<IRouteTransport[]>([]);
  const [sortOrder, setSortOrder] = useState<ISortOrder>({ column: "", ascending: true });

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

  const routeTransportDeleteMutation = useMutation((routeTransportId: number) => deleteRouteTransport(routeTransportId, dispatch), {
    retry: false,
    onSuccess: () => {
      queryClient.invalidateQueries("getCompany");
      queryClient.invalidateQueries(["getRouteTransportsOfPermit", Number(permitId)]);

      setToastMessage({ message: t("management.transportDetail.deleted"), color: "" });
    },
    onError: () => {
      setToastMessage({ message: t("common.error"), color: "danger" });
    },
  });

  const timePeriodText = (plannedDepartureTime?: Date, currentStatus?: IRouteTransportStatus, statusHistory?: IRouteTransportStatus[]) => {
    if (currentStatus && statusHistory && statusHistory.length > 0) {
      const { status, time: currentStatusTime } = currentStatus;
      const departureTime = getTransportDepartureTime(statusHistory);

      switch (status) {
        case TransportStatus.PLANNED: {
          const plannedTime = plannedDepartureTime ? moment(plannedDepartureTime) : null;
          return plannedTime ? `${t("management.companySummary.time.plannedTime")} ${plannedTime.format(DATE_TIME_FORMAT_MIN)}` : "";
        }
        case TransportStatus.DEPARTED:
        case TransportStatus.STOPPED:
        case TransportStatus.IN_PROGRESS: {
          return `${t("management.companySummary.time.departureTime")} ${departureTime ? departureTime.format(DATE_TIME_FORMAT_MIN) : ""}`;
        }
        case TransportStatus.ARRIVED: {
          const arrivalTime = moment(currentStatusTime);
          return `${departureTime ? departureTime.format(DATE_TIME_FORMAT_MIN) : ""} - ${arrivalTime.format(DATE_TIME_FORMAT_MIN)}`;
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

  const sortColumn = (columnId: string) => {
    setSortOrder((prevState: ISortOrder) => {
      const { column, ascending } = prevState;
      // If column is the same, toggle ascending, otherwise default is ascending
      return { column: columnId, ascending: column === columnId ? !ascending : true };
    });
  };

  const getColumnStyle = (columnId: string): string | undefined => {
    const { column, ascending } = sortOrder;
    if (columnId === column) {
      return ascending ? "ascendingColumn" : "descendingColumn";
    }
    return undefined;
  };

  const deletePlannedRouteTransport = (routeTransportId: number) => {
    if (!!routeTransportId && routeTransportId > 0) {
      // Ask the user to confirm the delete
      present({
        header: t("management.transportDetail.buttons.deleteTransport"),
        message: t("management.transportDetail.alert.deleteTransport"),
        buttons: [{ text: t("common.answer.yes"), handler: () => routeTransportDeleteMutation.mutate(routeTransportId) }, t("common.answer.no")],
      });
    }
  };

  useEffect(() => {
    if (routeTransports && routeTransports.length > 0) {
      const transports = filterTransports(routeTransports, transportFilter);
      sortTransports(transports, sortOrder);
      setSortedTransports(transports);
    }
  }, [routeTransports, sortOrder, transportFilter]);

  return (
    <IonGrid className="routeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="24" size-lg="3">
          <IonItem lines="none" color="light" button onClick={() => sortColumn("tractor")} className={getColumnStyle("tractor")}>
            {t("management.companySummary.route.tractorUnit").toUpperCase()}
          </IonItem>
        </IonCol>
        <IonCol size="24" size-lg="8">
          <IonItem lines="none" color="light" button onClick={() => sortColumn("route")} className={getColumnStyle("route")}>
            {t("management.companySummary.route.route").toUpperCase()}
          </IonItem>
        </IonCol>
        <IonCol size="24" size-lg="4">
          <IonItem lines="none" color="light" button onClick={() => sortColumn("time")} className={getColumnStyle("time")}>
            {t("management.companySummary.route.time").toUpperCase()}
          </IonItem>
        </IonCol>
        <IonCol size="24" size-lg="3">
          <IonItem lines="none" color="light">
            {t("management.companySummary.route.password").toUpperCase()}
          </IonItem>
        </IonCol>
        <IonCol size="24" size-lg="3">
          <IonItem lines="none" color="light" button onClick={() => sortColumn("status")} className={getColumnStyle("status")}>
            {t("management.companySummary.route.status").toUpperCase()}
          </IonItem>
        </IonCol>
        <IonCol size="24" size-lg="3">
          <IonItem lines="none" color="light">
            {t("management.companySummary.route.action").toUpperCase()}
          </IonItem>
        </IonCol>
      </IonRow>

      {sortedTransports.length > 0 &&
        sortedTransports.map((routeTransport) => {
          const {
            id: routeTransportId,
            tractorUnit,
            plannedDepartureTime,
            currentTransportPassword,
            currentStatus,
            statusHistory = [],
            route,
            supervisions = [],
          } = routeTransport;
          const { name: routeName } = route || {};
          const { transportPassword } = currentTransportPassword || {};
          const { status } = currentStatus || {};
          const supervisionsOk = areSupervisionsValid(supervisions);
          const supervisionStarted = hasSupervisionStarted(supervisions);

          const statusText = status ? t(`management.transportStatus.${status.toLowerCase()}`) : t("management.transportStatus.unknown");
          const action = isTransportEditable(routeTransport, permit)
            ? t("management.companySummary.action.modify")
            : t("management.companySummary.action.details");

          const key = `routetransport_${routeTransportId}`;

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
                      <IonText>{timePeriodText(plannedDepartureTime, currentStatus, statusHistory)}</IonText>
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
                          className={`ion-text-nowrap linkText routeGridStatus routeGridStatus_${status?.toLowerCase()}`}
                          onClick={() => showStatusLog(true, statusHistory)}
                        >
                          {statusText}
                        </IonText>
                      )}

                      {status === TransportStatus.PLANNED && supervisionStarted && (
                        <>
                          <IonIcon className="routeGridStatusSupervisionStarted" icon={warningOutline} />
                          <IonText className="routeGridStatusSupervisionStarted">{t("management.transportStatus.supervisionStarted")}</IonText>
                        </>
                      )}
                      {status === TransportStatus.PLANNED && !supervisionStarted && !isCurrentVersion && (
                        <>
                          <IonIcon className="routeGridStatusUnknown" icon={warningOutline} />
                          <IonText className="routeGridStatusUnknown">{t("management.transportStatus.outdatedPermit")}</IonText>
                        </>
                      )}
                      {status === TransportStatus.PLANNED && !supervisionStarted && isCurrentVersion && !supervisionsOk && (
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
                  {/*Allow removing planned transport for outdated permit versions*/}
                  {status === TransportStatus.PLANNED && !supervisionStarted && !isCurrentVersion && (
                    <IonRow>
                      <IonCol size="5" size-sm="3" className="ion-hide-lg-up" />
                      <IonCol size="7" size-sm="9" size-lg="12">
                        <IonText
                          className="linkText"
                          onClick={() => {
                            deletePlannedRouteTransport(routeTransportId);
                          }}
                        >
                          {t("management.companySummary.action.delete")}
                        </IonText>
                      </IonCol>
                    </IonRow>
                  )}
                </IonGrid>
              </IonCol>
            </IonRow>
          );
        })}

      <RouteStatusLog isOpen={isStatusLogOpen} setOpen={setStatusLogOpen} statusHistory={statusLog} />
      <IonToast
        isOpen={toastMessage.message.length > 0}
        message={toastMessage.message}
        onDidDismiss={() => setToastMessage({ message: "", color: "" })}
        duration={5000}
        position="top"
        color={toastMessage.color ? toastMessage.color : "success"}
      />
    </IonGrid>
  );
};

export default RouteGrid;
