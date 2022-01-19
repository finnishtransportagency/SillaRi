import React, { MouseEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { IonCol, IonGrid, IonIcon, IonRow, IonText, useIonPopover } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRouteTransportStatus from "../../interfaces/IRouteTransportStatus";
import ISupervision from "../../interfaces/ISupervision";
import { actions } from "../../store/rootSlice";
import close from "../../theme/icons/close.svg";
import { onRetry } from "../../utils/backendData";
import { getRouteTransportsOfPermit } from "../../utils/managementBackendData";
import { DATE_TIME_FORMAT_MIN, SupervisorType, TransportStatus } from "../../utils/constants";
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
      <IonRow>
        <IonCol size="10">
          <IonText>{popoverText}</IonText>
        </IonCol>
        <IonCol size="2">
          <IonIcon
            className="otherIcon"
            icon={close}
            onClick={() => {
              setPopoverText("");
              dismissPassword();
            }}
          />
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

  const supervisionText = (supervisions?: ISupervision[]) => {
    // Get the unique non-null supervisor types and map them to translated text
    if (supervisions) {
      const supervisorTypes = supervisions
        .map((supervision) => {
          const { routeBridge } = supervision;
          const { contractNumber = 0 } = routeBridge || {};
          return contractNumber > 0 ? SupervisorType.AREA_CONTRACTOR : SupervisorType.OWN_SUPERVISOR;
        })
        .filter((v, i, a) => v && a.indexOf(v) === i);

      return supervisorTypes.length > 0
        ? supervisorTypes.map((st) => t(`management.supervisionType.${st.toLowerCase()}`)).join(", ")
        : t("management.supervisionType.unknown");
    } else {
      return t("management.supervisionType.unknown");
    }
  };

  const timePeriodText = (supervisions?: ISupervision[]) => {
    if (!!supervisions && supervisions.length > 0) {
      const plannedTimes = supervisions.map((supervision) => moment(supervision.plannedTime));
      const minPlannedTime = moment.min(plannedTimes);
      const maxPlannedTime = moment.max(plannedTimes);
      return `${minPlannedTime.format(DATE_TIME_FORMAT_MIN)} - ${maxPlannedTime.format(DATE_TIME_FORMAT_MIN)}`;
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
        <IonCol size="15" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.tractorUnit").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.route").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="3" className="ion-padding">
          <IonText>{t("management.companySummary.route.supervision").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.time").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.password").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.status").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="15" size-lg="2" className="ion-padding">
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
            const action =
              status === TransportStatus.PLANNED ? t("management.companySummary.action.modify") : t("management.companySummary.action.details");

            return (
              <IonRow key={key}>
                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonText className="headingText ion-hide-lg-up">{`${t("management.companySummary.route.tractorUnit")}: `}</IonText>
                  <IonText>{tractorUnit ? tractorUnit.toUpperCase() : ""}</IonText>
                </IonCol>

                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonGrid className="ion-no-padding">
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

                <IonCol size="15" size-lg="3" className="ion-padding">
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol size="12" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.supervision")}</IonText>
                      </IonCol>
                      <IonCol size="12">
                        <IonText>{supervisionText(supervisions)}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonGrid className="ion-no-padding">
                    <IonRow>
                      <IonCol size="12" className="ion-hide-lg-up">
                        <IonText className="headingText">{t("management.companySummary.route.time")}</IonText>
                      </IonCol>
                      <IonCol size="12">
                        <IonText>{timePeriodText(supervisions)}</IonText>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonGrid className="ion-no-padding">
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

                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonGrid className="ion-no-padding">
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
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>

                <IonCol size="15" size-lg="2" className="ion-padding">
                  <IonGrid className="ion-no-padding">
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
