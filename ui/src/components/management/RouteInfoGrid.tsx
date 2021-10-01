import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { flagOutline } from "ionicons/icons";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import { actions as crossingActions } from "../../store/crossingsSlice";
import { useTypedSelector } from "../../store/store";

interface RouteInfoGridProps {
  permitRoutes: IRoute[];
  routeTransport?: IRouteTransport;
}

const RouteInfoGrid = ({ permitRoutes = [], routeTransport }: RouteInfoGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { selectedRouteOption } = crossings;
  const { id: routeId, departureAddress, arrivalAddress } = selectedRouteOption || {};
  const { streetaddress: departureStreetAddress } = departureAddress || {};
  const { streetaddress: arrivalStreetAddress } = arrivalAddress || {};

  const { plannedDepartureTime } = routeTransport || {};
  const estimatedDeparture = moment(plannedDepartureTime);

  const selectRoute = (selectedRouteId: number) => {
    const selectedRoute = permitRoutes.find((route) => route.id === selectedRouteId);
    dispatch({ type: crossingActions.SET_SELECTED_ROUTE_OPTION, payload: selectedRoute });
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.estimatedDepartureDate")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <DatePicker value={estimatedDeparture.toDate()} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.estimatedDepartureTime")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <TimePicker value={estimatedDeparture.toDate()} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="6">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.routeInfo.route")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonSelect
                  interface="action-sheet"
                  cancelText={t("common.buttons.back")}
                  value={routeId}
                  onIonChange={(e) => selectRoute(e.detail.value)}
                >
                  {permitRoutes.map((route, index) => {
                    const { id, name } = route;
                    const key = `route_${index}`;

                    return (
                      <IonSelectOption key={key} value={id}>
                        {name}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-lg="8">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.addTransport.routeInfo.origin")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{departureStreetAddress}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.addTransport.routeInfo.destination")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{arrivalStreetAddress}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="4">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin">
              <IonCol size="12" size-lg="5" />
              <IonCol size="12" size-lg="7">
                <IonText>{`${t("management.addTransport.routeInfo.showRouteOnMap")} `}</IonText>
                <IonIcon icon={flagOutline} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RouteInfoGrid;
