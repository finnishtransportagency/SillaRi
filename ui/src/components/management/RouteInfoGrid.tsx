import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { IonCol, IonGrid, IonIcon, IonRow, IonText } from "@ionic/react";
import Moment from "react-moment";
import moment from "moment";
import CustomSelect from "../common/CustomSelect";
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

  const setTractorUnit = (vehicleId: number) => {
    const vehicle = vehicles.find((v) => v.id === vehicleId);
    setSelectedVehicle(vehicle);
    if (modifiedRouteTransportDetail && vehicle) {
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
          const { id: routeBridgeId, contractNumber = 0 } = routeBridge;
          return {
            id: 0,
            routeBridgeId,
            routeTransportId,
            plannedTime: moment().toDate(),
            conformsToPermit: false,
            supervisorType: contractNumber > 0 ? SupervisorType.AREA_CONTRACTOR : SupervisorType.OWN_SUPERVISOR,
            supervisors: [],
            routeBridge: routeBridge,
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
                  <CustomSelect
                    options={permitRoutes.map((route) => {
                      const { id: routeId, name } = route;
                      return { value: routeId, label: name };
                    })}
                    selectedValue={selectedRouteId}
                    onChange={(routeId) => selectRoute(routeId as number)}
                  />
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
            <IonCol size="12" size-lg="4">
              {status === TransportStatus.PLANNED && (
                <CustomSelect
                  options={vehicles
                    .filter((vehicle) => !!vehicle.identifier)
                    .map((vehicle) => {
                      const { id: vehicleId, type, identifier } = vehicle;
                      return { value: vehicleId, label: `${identifier.toUpperCase()} (${type.toLocaleLowerCase()})` };
                    })}
                  selectedValue={selectedVehicle?.id}
                  onChange={(vehicleId) => setTractorUnit(vehicleId as number)}
                />
              )}
              {status !== TransportStatus.PLANNED && (
                <IonText>
                  {selectedVehicle ? selectedVehicle.identifier.toUpperCase() : t("management.transportDetail.routeInfo.tractorUnitNotSelected")}
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
