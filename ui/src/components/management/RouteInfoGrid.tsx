import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { IonCol, IonGrid, IonIcon, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import Moment from "react-moment";
import moment from "moment";
import DatePicker from "../common/DatePicker";
import TimePicker from "../common/TimePicker";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervision from "../../interfaces/ISupervision";
import mapPoint from "../../theme/icons/map-point.svg";
import { DATE_FORMAT, SupervisorType, TIME_FORMAT_MIN, TransportStatus } from "../../utils/constants";
import IPermit from "../../interfaces/IPermit";
import IVehicle from "../../interfaces/IVehicle";

interface RouteInfoGridProps {
  routeTransportId: number;
  permit: IPermit;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
  setSelectedRouteOption: Dispatch<SetStateAction<IRoute | undefined>>;
  selectedVehicle: IVehicle | undefined;
  setSelectedVehicle: Dispatch<SetStateAction<IVehicle | undefined>>;
}

const RouteInfoGrid = ({
  routeTransportId,
  permit,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
  selectedRouteOption,
  setSelectedRouteOption,
  selectedVehicle,
  setSelectedVehicle,
}: RouteInfoGridProps): JSX.Element => {
  const { t } = useTranslation();

  const { routes: permitRoutes = [], vehicles = [] } = permit || {};
  const { plannedDepartureTime, currentStatus } = modifiedRouteTransportDetail || {};
  const { status } = currentStatus || {};
  const { id: selectedRouteId, name: selectedRouteName, departureAddress, arrivalAddress } = selectedRouteOption || {};
  const { streetAddress: departureStreetAddress } = departureAddress || {};
  const { streetAddress: arrivalStreetAddress } = arrivalAddress || {};

  const estimatedDeparture = moment(plannedDepartureTime);

  const setPlannedDepartureTime = (dateTime: Date) => {
    if (modifiedRouteTransportDetail) {
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, plannedDepartureTime: dateTime };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const setTractorUnit = (vehicle: IVehicle) => {
    setSelectedVehicle(vehicle);
    if (modifiedRouteTransportDetail) {
      const newDetail: IRouteTransport = { ...modifiedRouteTransportDetail, tractorUnit: vehicle.identifier };
      setModifiedRouteTransportDetail(newDetail);
    }
  };

  const selectRoute = (routeId: number) => {
    const selectedRoute = permitRoutes.find((route) => route.id === routeId);
    if (selectedRoute) {
      setSelectedRouteOption(selectedRoute);

      if (modifiedRouteTransportDetail && (!routeTransportId || routeTransportId === 0)) {
        // This is a new route transport, so make sure supervision details are available for BridgeGrid
        const { routeBridges = [] } = selectedRoute || {};
        const newSupervisions: ISupervision[] = routeBridges.map((routeBridge) => {
          const { id: routeBridgeId } = routeBridge;
          return {
            id: 0,
            routeBridgeId,
            routeTransportId,
            plannedTime: moment().toDate(),
            conformsToPermit: false,
            supervisorType: SupervisorType.OWN_SUPERVISOR,
            supervisors: [],
          };
        });
        const newDetail: IRouteTransport = {
          ...modifiedRouteTransportDetail,
          routeId,
          route: selectedRoute,
          supervisions: newSupervisions,
        };
        setModifiedRouteTransportDetail(newDetail);
      }
    }
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.estimatedDepartureDate")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                {status === TransportStatus.PLANNED && <DatePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />}
                {status !== TransportStatus.PLANNED && <Moment format={DATE_FORMAT}>{estimatedDeparture}</Moment>}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size-lg="3">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-start ion-margin-end ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.estimatedDepartureTime")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-start ion-margin-end">
              <IonCol>
                {status === TransportStatus.PLANNED && <TimePicker value={estimatedDeparture.toDate()} onChange={setPlannedDepartureTime} />}
                {status !== TransportStatus.PLANNED && <Moment format={TIME_FORMAT_MIN}>{estimatedDeparture}</Moment>}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="6">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.route")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                {status === TransportStatus.PLANNED && (
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
                )}
                {status !== TransportStatus.PLANNED && <IonText>{selectedRouteName}</IonText>}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" size-lg="8">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.transportDetail.routeInfo.origin")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{departureStreetAddress}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin-top">
              <IonCol size="12" size-sm="4">
                <IonText className="headingText">{t("management.transportDetail.routeInfo.destination")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8">
                <IonText>{arrivalStreetAddress}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="4">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol size="12" size-lg="4" />
              <IonCol size="12" size-lg="8">
                <Link to={`/routemap/${selectedRouteId}`}>
                  <IonText className="linkText">{t("management.transportDetail.routeInfo.showRouteOnMap")}</IonText>
                  <IonIcon className="otherIcon" icon={mapPoint} />
                </Link>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="ion-margin-top">
        <IonGrid className="ion-no-padding">
          <IonRow className="ion-margin-top">
            <IonCol size="12" size-lg="12">
              <IonText className="headingText">{t("management.transportDetail.routeInfo.tractorUnitIdentifier")}</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12" size-lg="2">
              {status === TransportStatus.PLANNED && (
                <IonSelect
                  interface="action-sheet"
                  cancelText={t("common.buttons.back")}
                  value={selectedVehicle}
                  onIonChange={(e) => setTractorUnit(e.detail.value)}
                >
                  {vehicles.map((vehicle, index) => {
                    const { type, identifier } = vehicle;
                    const key = `vehicle_${index}`;
                    return (
                      <IonSelectOption key={key} value={vehicle}>
                        {identifier}
                      </IonSelectOption>
                    );
                  })}
                </IonSelect>
              )}
              {status !== TransportStatus.PLANNED && (
                <IonText>
                  {selectedVehicle
                    ? `${selectedVehicle.identifier} (${selectedVehicle.type})`
                    : t("management.transportDetail.routeInfo.tractorUnitNotSelected")}
                </IonText>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonRow>
    </IonGrid>
  );
};

export default RouteInfoGrid;
