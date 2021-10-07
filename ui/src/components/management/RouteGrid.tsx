import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonCol, IonGrid, IonRouterLink, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import ISupervision from "../../interfaces/ISupervision";
import { useTypedSelector } from "../../store/store";
import { getRouteTransportsOfPermit, onRetry } from "../../utils/managementBackendData";
import { DATE_TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import "./RouteGrid.css";

interface RouteGridProps {
  permit: IPermit;
  transportFilter: string;
}

const RouteGrid = ({ permit, transportFilter }: RouteGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);
  const { routeTransportList } = management;

  const { id: permitId } = permit;

  useQuery(["getRouteTransportsOfPermit", permitId], () => getRouteTransportsOfPermit(Number(permitId), dispatch), {
    retry: onRetry,
  });

  const supervisionText = (supervisions?: ISupervision[]) => {
    // Get the unique non-null supervisor types and map them to translated text
    if (supervisions) {
      const supervisorTypes = supervisions.map((supervision) => supervision.supervisorType).filter((v, i, a) => v && a.indexOf(v) === i);
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

  return (
    <IonGrid className="routeGrid ion-no-padding">
      <IonRow className="lightBackground ion-hide-lg-down">
        <IonCol size="12" size-lg="1" className="ion-padding">
          <IonText>{t("management.companySummary.route.id").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="3" className="ion-padding">
          <IonText>{t("management.companySummary.route.route").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.supervision").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.time").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.status").toUpperCase()}</IonText>
        </IonCol>
        <IonCol size="12" size-lg="2" className="ion-padding">
          <IonText>{t("management.companySummary.route.action").toUpperCase()}</IonText>
        </IonCol>
      </IonRow>

      {routeTransportList
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
        .sort((a, b) => {
          const am = moment(a.plannedDepartureTime);
          const bm = moment(b.plannedDepartureTime);
          return bm.diff(am, "seconds");
        })
        .map((routeTransport, index) => {
          const key = `routetransport_${index}`;
          const { id: routeTransportId, currentStatus, route, supervisions } = routeTransport;
          const { name: routeName } = route || {};
          const { status } = currentStatus || {};

          const statusText = status ? t(`management.transportStatus.${status.toLowerCase()}`) : t("management.transportStatus.unknown");
          const action =
            status === TransportStatus.PLANNED ? t("management.companySummary.action.modify") : t("management.companySummary.action.details");

          return (
            <IonRow key={key}>
              <IonCol size="12" size-lg="1" className="ion-padding">
                <IonText className="headingText ion-hide-lg-up">{`${t("management.companySummary.route.id")}: `}</IonText>
                <IonText>{routeTransportId}</IonText>
              </IonCol>

              <IonCol size="12" size-lg="3" className="ion-padding">
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

              <IonCol size="12" size-lg="2" className="ion-padding">
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

              <IonCol size="12" size-lg="2" className="ion-padding">
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

              <IonCol size="12" size-lg="2" className="ion-padding">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.companySummary.route.status")}</IonText>
                    </IonCol>
                    <IonCol size="7" size-sm="9" size-lg="12">
                      <IonText>{statusText}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>

              <IonCol size="12" size-lg="2" className="ion-padding">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="5" size-sm="3" className="ion-hide-lg-up">
                      <IonText className="headingText">{t("management.companySummary.route.action")}</IonText>
                    </IonCol>
                    <IonCol size="7" size-sm="9" size-lg="12">
                      <IonRouterLink routerLink={`/management/transportDetail/${routeTransportId}`}>
                        <IonText className="linkText">{action}</IonText>
                      </IonRouterLink>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          );
        })}
    </IonGrid>
  );
};

export default RouteGrid;
