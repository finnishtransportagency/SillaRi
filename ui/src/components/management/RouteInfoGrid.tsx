import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonIcon, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { flagOutline } from "ionicons/icons";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRoute from "../../interfaces/IRoute";
import { actions as managementActions } from "../../store/managementSlice";
import { useTypedSelector } from "../../store/store";
import { SupervisorType } from "../../utils/constants";

interface RouteInfoGridProps {
  permitRoutes: IRoute[];
}

const RouteInfoGrid = ({ permitRoutes = [] }: RouteInfoGridProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);
  const { modifiedRouteTransportDetail, selectedRouteOption } = management;
  const { plannedDepartureTime } = modifiedRouteTransportDetail || {};
  const { id: selectedRouteId, departureAddress, arrivalAddress } = selectedRouteOption || {};
  const { streetaddress: departureStreetAddress } = departureAddress || {};
  const { streetaddress: arrivalStreetAddress } = arrivalAddress || {};

  const estimatedDeparture = moment(plannedDepartureTime);

  const setPlannedDepartureTime = (dateTime: Date) => {
    dispatch({ type: managementActions.MODIFY_ROUTE_TRANSPORT, payload: { plannedDepartureTime: dateTime } });
  };

  const selectRoute = (routeId: number) => {
    const selectedRoute = permitRoutes.find((route) => route.id === routeId);
    dispatch({ type: managementActions.SET_SELECTED_ROUTE_OPTION, payload: selectedRoute });

    // Make sure supervision details are available for BridgeGrid
    const { routeBridges = [] } = selectedRoute || {};
    const newSupervisions = routeBridges.map((routeBridge) => {
      const { id: routeBridgeId } = routeBridge;
      return {
        plannedTime: moment().toDate(),
        routeBridgeId,
        supervisorType: SupervisorType.OWN_SUPERVISOR,
        supervisors: [],
      };
    });
    dispatch({
      type: managementActions.SET_MODIFIED_ROUTE_TRANSPORT_DETAIL,
      payload: { ...modifiedRouteTransportDetail, routeId, route: selectedRoute, supervisions: newSupervisions },
    });
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
                <DatePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />
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
                <TimePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />
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
                  value={selectedRouteId}
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
