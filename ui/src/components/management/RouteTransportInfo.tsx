import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonItemDivider, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervisor from "../../interfaces/ISupervisor";
import { createRouteTransport, deleteRouteTransport, onRetry, updateRouteTransport } from "../../utils/managementBackendData";
import { DATE_FORMAT, TransportStatus } from "../../utils/constants";
import BridgeGrid from "./BridgeGrid";
import RouteInfoGrid from "./RouteInfoGrid";
import TransportInfoAccordion from "./TransportInfoAccordion";

interface RouteTransportInfoProps {
  routeTransportId: number;
  permit: IPermit;
  supervisors: ISupervisor[];
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
  setSelectedRouteOption: Dispatch<SetStateAction<IRoute | undefined>>;
  setToastMessage: Dispatch<SetStateAction<string>>;
}

const RouteTransportInfo = ({
  routeTransportId,
  permit,
  supervisors,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
  selectedRouteOption,
  setSelectedRouteOption,
  setToastMessage,
}: RouteTransportInfoProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();

  const { companyId, permitNumber, validStartDate, validEndDate, routes = [] } = permit || {};
  const { currentStatus } = modifiedRouteTransportDetail || {};
  const { status } = currentStatus || {};

  // Set-up mutations for modifying data later
  // TODO - handle errors
  const routeTransportPlannedMutation = useMutation((transport: IRouteTransport) => createRouteTransport(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.addTransport.saved"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace(`/management/${companyId}`);
    },
  });
  const routeTransportUpdateMutation = useMutation((transport: IRouteTransport) => updateRouteTransport(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.addTransport.saved"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace(`/management/${companyId}`);
    },
  });
  const routeTransportDeleteMutation = useMutation((routeTransportIdToDelete: number) => deleteRouteTransport(routeTransportIdToDelete, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.addTransport.deleted"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace(`/management/${companyId}`);
    },
  });

  const { isLoading: isSendingTransportUpdate } = routeTransportUpdateMutation;
  const { isLoading: isDeletingTransport } = routeTransportDeleteMutation;

  const saveRouteTransportDetail = () => {
    // The backend methods handle the status values, so these should be left undefined here
    if (!!routeTransportId && routeTransportId > 0) {
      routeTransportUpdateMutation.mutate({ ...modifiedRouteTransportDetail, currentStatus: undefined });
    } else {
      routeTransportPlannedMutation.mutate({ ...modifiedRouteTransportDetail, currentStatus: undefined });
    }
  };

  const deleteRouteTransportDetail = () => {
    if (!!routeTransportId && routeTransportId > 0) {
      routeTransportDeleteMutation.mutate(routeTransportId);
    }
  };

  return (
    <IonGrid className="ion-no-padding" fixed>
      <IonRow>
        <IonCol size="12" size-lg="4" className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="5">
                <IonText className="headingText">{t("management.addTransport.transportPermit")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="7">
                <IonText>{permitNumber}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="5" className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="5">
                <IonText className="headingText">{t("management.addTransport.validityPeriod")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="7">
                <IonText>{`${moment(validStartDate).format(DATE_FORMAT)} - ${moment(validEndDate).format(DATE_FORMAT)}`}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="3" className="whiteBackground">
          {!!routeTransportId && routeTransportId > 0 && (
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
                <IonCol size="12" size-sm="4" size-lg="7">
                  <IonText className="headingText">{t("management.addTransport.transportId")}</IonText>
                </IonCol>
                <IonCol size="12" size-sm="8" size-lg="5">
                  <IonText>{routeTransportId}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          )}
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonItemDivider />

            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.transportInformation")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol>
                <RouteInfoGrid
                  routeTransportId={routeTransportId}
                  permitRoutes={routes}
                  modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                  setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
                  selectedRouteOption={selectedRouteOption}
                  setSelectedRouteOption={setSelectedRouteOption}
                />
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin">
              <IonCol>
                <TransportInfoAccordion permit={permit} />
              </IonCol>
            </IonRow>

            {selectedRouteOption && (
              <>
                <IonRow className="ion-margin">
                  <IonCol>
                    <IonText className="headingText">{t("management.addTransport.bridgesToSupervise")}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                  <IonCol>
                    <BridgeGrid
                      supervisors={supervisors}
                      modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                      setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
                      selectedRouteOption={selectedRouteOption}
                    />
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonGrid>
        </IonCol>
      </IonRow>

      {status === TransportStatus.PLANNED && (
        <IonRow className="ion-margin ion-justify-content-end">
          {!!routeTransportId && routeTransportId > 0 && (
            <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
              <IonButton
                color="tertiary"
                disabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption}
                onClick={deleteRouteTransportDetail}
              >
                <IonText>{t("management.addTransport.buttons.deleteTransport")}</IonText>
              </IonButton>
            </IonCol>
          )}
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton color="secondary" disabled={isSendingTransportUpdate || isDeletingTransport} onClick={() => history.goBack()}>
              <IonText>{t("common.buttons.cancel")}</IonText>
            </IonButton>
          </IonCol>
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton
              color="primary"
              disabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption}
              onClick={saveRouteTransportDetail}
            >
              <IonText>{t("common.buttons.save")}</IonText>
            </IonButton>
          </IonCol>
        </IonRow>
      )}

      {status !== TransportStatus.PLANNED && (
        <IonRow className="ion-margin ion-justify-content-end">
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton color="primary" disabled={isSendingTransportUpdate || isDeletingTransport} onClick={() => history.goBack()}>
              <IonText>{t("common.buttons.back2")}</IonText>
            </IonButton>
          </IonCol>
        </IonRow>
      )}
    </IonGrid>
  );
};

export default RouteTransportInfo;
