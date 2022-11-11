import React, { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import CustomSelect from "../common/CustomSelect";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervision from "../../interfaces/ISupervision";
import IVehicle from "../../interfaces/IVehicle";
import { SupervisorType, VehicleRole } from "../../utils/constants";
import { isTransportEditable } from "../../utils/validation";
import MapModal from "../MapModal";
import TransportDepartureTime from "./TransportDepartureTime";
import RouteAccordion from "../RouteAccordion";
import AlertPopover from "../common/AlertPopover";

interface RouteInfoGridProps {
  routeTransportId: number;
  permit: IPermit;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
  setSelectedRouteOption: Dispatch<SetStateAction<IRoute | undefined>>;
  selectedVehicle: IVehicle | undefined;
  setSelectedVehicle: Dispatch<SetStateAction<IVehicle | undefined>>;
  currentTransportNumber: number;
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
  currentTransportNumber,
}: RouteInfoGridProps): JSX.Element => {
  const { t } = useTranslation();

  const [isMapModalOpen, setMapModalOpen] = useState<boolean>(false);
  const [transportNumberAlertOpen, setTransportNumberAlertOpen] = useState<boolean>(false);

  const { company, routes: permitRoutes = [], vehicles = [] } = permit || {};
  const { businessId = "" } = company || {};
  const { id: selectedRouteId, name: selectedRouteName } = selectedRouteOption || {};
  const { plannedDepartureTime } = modifiedRouteTransportDetail || {};

  const isEditable = isTransportEditable(modifiedRouteTransportDetail, permit);

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
      const { nextAvailableTransportNumber, routeBridges = [] } = selectedRoute;

      if (modifiedRouteTransportDetail && (!routeTransportId || routeTransportId === 0)) {
        // This is a new route transport, so make sure supervision details are available for BridgeSupervisionGrid
        let newSupervisions: ISupervision[] = [];

        // Set supervisions only if there are valid transport numbers available for transport
        if (nextAvailableTransportNumber) {
          newSupervisions = routeBridges.map((routeBridge) => {
            const { id: routeBridgeId, contractBusinessId = "" } = routeBridge;
            return {
              id: 0,
              routeBridgeId,
              routeTransportId,
              plannedTime: plannedDepartureTime ? moment(plannedDepartureTime).toDate() : moment().toDate(),
              conformsToPermit: false,
              // If contractBusinessId is provided from LeLu, supervisor is the area contractor. Otherwise, it's the current company.
              supervisorCompany: contractBusinessId ? contractBusinessId : businessId,
              supervisorType: contractBusinessId ? SupervisorType.AREA_CONTRACTOR : SupervisorType.OWN_SUPERVISOR,
              routeBridge: routeBridge,
            };
          });
        }

        const newDetail: IRouteTransport = {
          ...modifiedRouteTransportDetail,
          routeId,
          route: selectedRoute,
          transportNumber: nextAvailableTransportNumber,
          supervisions: newSupervisions,
        };
        setModifiedRouteTransportDetail(newDetail);

        // If all transport numbers are used for this route, show warning
        if (!nextAvailableTransportNumber) {
          setTransportNumberAlertOpen(true);
        }
      }
    }
  };

  const openRouteMap = () => {
    setMapModalOpen(true);
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin-top">
        <TransportDepartureTime
          isEditable={isEditable}
          modifiedRouteTransportDetail={modifiedRouteTransportDetail}
          setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
        />
      </IonRow>
      <IonRow>
        <IonCol size="12" size-lg="8">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top">
              <IonCol>
                <IonText className="headingText">{t("management.transportDetail.routeInfo.route")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                {isEditable ? (
                  <CustomSelect
                    options={permitRoutes
                      .sort((a, b) => {
                        return a.ordinal - b.ordinal;
                      })
                      .map((route) => {
                        const { id: routeId, name } = route;
                        return { value: routeId, label: name };
                      })}
                    selectedValue={selectedRouteId}
                    onChange={(routeId) => selectRoute(routeId as number)}
                    disabled={!!routeTransportId || plannedDepartureTime == null} // Prevent changing route when transport has been saved
                  />
                ) : (
                  <IonText>{selectedRouteName}</IonText>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol size="12" className="ion-margin-top">
          {selectedRouteOption && (
            <RouteAccordion route={selectedRouteOption as IRoute} transportNumber={currentTransportNumber} openMap={openRouteMap} />
          )}
          <MapModal routeId={String(selectedRouteId)} isOpen={isMapModalOpen} setIsOpen={() => setMapModalOpen(false)} />
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
              {isEditable ? (
                <CustomSelect
                  options={vehicles
                    .filter((vehicle) => !!vehicle.identifier && (!vehicle.role || vehicle.role !== VehicleRole.TRAILER))
                    .map((vehicle) => {
                      const { id: vehicleId, identifier, role } = vehicle;
                      const isPushingVehicle = role && role === VehicleRole.PUSHING_VEHICLE;
                      const vehicleLabel = isPushingVehicle
                        ? `${identifier.toUpperCase()} (${t("management.transportDetail.routeInfo.pushingVehicle")})`
                        : identifier.toUpperCase();
                      return { value: vehicleId, label: vehicleLabel };
                    })}
                  selectedValue={selectedVehicle?.id}
                  onChange={(vehicleId) => setTractorUnit(vehicleId as number)}
                />
              ) : (
                <IonText>
                  {selectedVehicle ? selectedVehicle.identifier.toUpperCase() : t("management.transportDetail.routeInfo.tractorUnitNotSelected")}
                </IonText>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonRow>
      <AlertPopover
        title={t("common.validation.transportNumbersUsed")}
        text={t("common.validation.transportNumbersUsedInfo")}
        isOpen={transportNumberAlertOpen}
        setOpen={setTransportNumberAlertOpen}
      />
    </IonGrid>
  );
};

export default RouteInfoGrid;
