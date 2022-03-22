import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonButton, IonCol, IonGrid, IonItemDivider, IonPopover, IonRow, IonText, useIonAlert, useIonPopover } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervisor from "../../interfaces/ISupervisor";
import { onRetry } from "../../utils/backendData";
import {
  createRouteTransport,
  deleteRouteTransport,
  generateNewRouteTransportPassword,
  updateRouteTransport,
} from "../../utils/managementBackendData";
import { DATE_FORMAT } from "../../utils/constants";
import { isPermitValid, isTransportEditable, hasSupervisionTimeErrors } from "../../utils/validation";
import BridgeGrid from "./BridgeGrid";
import PermitLinkText from "../PermitLinkText";
import RouteInfoGrid from "./RouteInfoGrid";
import TransportInfoAccordion from "../TransportInfoAccordion";
import TransportPassword from "./TransportPassword";
import IVehicle from "../../interfaces/IVehicle";
import MultiSupervisorsSelection from "./MultiSupervisorsSelection";
import SupervisionTimesAlert from "./SupervisionTimesAlert";

interface RouteTransportInfoProps {
  routeTransportId: number;
  permit: IPermit;
  supervisors: ISupervisor[];
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
  setSelectedRouteOption: Dispatch<SetStateAction<IRoute | undefined>>;
  selectedVehicle: IVehicle | undefined;
  setSelectedVehicle: Dispatch<SetStateAction<IVehicle | undefined>>;
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
  selectedVehicle,
  setSelectedVehicle,
  setToastMessage,
}: RouteTransportInfoProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [present] = useIonAlert();
  const [supervisionTimesAlertOpen, setSupervisionTimesAlertOpen] = useState<boolean>(false);

  const { validStartDate, validEndDate } = permit || {};
  const { routeBridges = [] } = selectedRouteOption || {};

  const isEditable = isTransportEditable(modifiedRouteTransportDetail, permit);

  // Set-up mutations for modifying data later
  // TODO - handle errors
  const routeTransportPlannedMutation = useMutation((transport: IRouteTransport) => createRouteTransport(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.transportDetail.saved"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace("/management");
    },
  });
  const routeTransportUpdateMutation = useMutation((transport: IRouteTransport) => updateRouteTransport(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.transportDetail.saved"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace("/management");
    },
  });
  const routeTransportDeleteMutation = useMutation((routeTransportIdToDelete: number) => deleteRouteTransport(routeTransportIdToDelete, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage(t("management.transportDetail.deleted"));

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace("/management");
    },
  });
  const routeTransportPasswordMutation = useMutation(
    (routeTransportIdToGenerate: number) => generateNewRouteTransportPassword(routeTransportIdToGenerate, dispatch),
    {
      retry: onRetry,
      onSuccess: (data) => {
        // Update the password in the modified details
        const newDetail: IRouteTransport = {
          ...modifiedRouteTransportDetail,
          currentTransportPassword: data,
        };
        setModifiedRouteTransportDetail(newDetail);
      },
    }
  );

  const { isLoading: isSendingTransportUpdate } = routeTransportUpdateMutation;
  const { isLoading: isDeletingTransport } = routeTransportDeleteMutation;

  const saveRouteTransportDetail = () => {
    // The backend methods handle the status values, so these should be left undefined here
    if (!!routeTransportId && routeTransportId > 0) {
      routeTransportUpdateMutation.mutate({ ...modifiedRouteTransportDetail, currentStatus: undefined, currentTransportPassword: undefined });
    } else {
      routeTransportPlannedMutation.mutate({ ...modifiedRouteTransportDetail, currentStatus: undefined, currentTransportPassword: undefined });
    }
  };

  const deleteRouteTransportDetail = () => {
    if (!!routeTransportId && routeTransportId > 0) {
      // Ask the user to confirm the delete
      present({
        header: t("management.transportDetail.buttons.deleteTransport"),
        message: t("management.transportDetail.alert.deleteTransport"),
        buttons: [{ text: t("common.answer.yes"), handler: () => routeTransportDeleteMutation.mutate(routeTransportId) }, t("common.answer.no")],
      });
    }
  };

  const [presentPassword, dismissPassword] = useIonPopover(
    <TransportPassword
      routeTransportId={routeTransportId}
      permit={permit}
      modifiedRouteTransportDetail={modifiedRouteTransportDetail}
      isSendingTransportUpdate={isSendingTransportUpdate}
      routeTransportPasswordMutation={routeTransportPasswordMutation}
      dismissPassword={() => dismissPassword()}
    />,
    {
      onHide: () => {
        dismissPassword();
      },
    }
  );

  const showPassword = (evt: MouseEvent) => {
    presentPassword({
      event: evt.nativeEvent,
    });
  };

  const validateSupervisionsAndSave = () => {
    const hasValidationErrors = hasSupervisionTimeErrors({ ...modifiedRouteTransportDetail });
    if (hasValidationErrors) {
      setSupervisionTimesAlertOpen(true);
    } else {
      saveRouteTransportDetail();
    }
  };

  return (
    <IonGrid className="ion-no-padding" fixed>
      <IonRow>
        <IonCol size="12" size-lg="4" className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="5">
                <IonText className="headingText">{t("management.transportDetail.transportPermit")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="7">
                <PermitLinkText permit={permit} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="5" className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="5">
                <IonText className="headingText">{t("management.transportDetail.validityPeriod")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="7">
                <IonText className={!isPermitValid(permit) ? "disabled" : ""}>{`${moment(validStartDate).format(DATE_FORMAT)} - ${moment(
                  validEndDate
                ).format(DATE_FORMAT)}`}</IonText>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>

        <IonCol size="12" size-lg="3" className="whiteBackground">
          {!!routeTransportId && routeTransportId > 0 && (
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
                <IonCol size="12" size-sm="4" size-lg="7">
                  <IonText className="headingText">{t("management.transportDetail.transportId")}</IonText>
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
                <IonText className="headingBoldText">{t("management.transportDetail.transportInformation")}</IonText>
              </IonCol>
            </IonRow>

            {!!routeTransportId && routeTransportId > 0 && (
              <IonRow className="ion-margin">
                <IonCol size="8" size-sm="4" size-lg="3" size-xl="2">
                  <IonText>{t("management.transportDetail.password")}</IonText>
                </IonCol>
                <IonCol size="4" size-sm="8" size-lg="9" size-xl="10">
                  <IonText className="linkText" onClick={(evt) => showPassword(evt)}>
                    {t("management.companySummary.action.show")}
                  </IonText>
                </IonCol>
              </IonRow>
            )}

            <IonRow className="ion-margin">
              <IonCol>
                <RouteInfoGrid
                  routeTransportId={routeTransportId}
                  permit={permit}
                  modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                  setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
                  selectedRouteOption={selectedRouteOption}
                  setSelectedRouteOption={setSelectedRouteOption}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                />
              </IonCol>
            </IonRow>

            <IonRow className="ion-margin">
              <IonCol>
                <TransportInfoAccordion permit={permit} />
              </IonCol>
            </IonRow>

            {selectedRouteOption && isEditable && (
              <MultiSupervisorsSelection
                supervisors={supervisors}
                modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
              />
            )}

            {selectedRouteOption && (
              <>
                <IonRow className="ion-margin">
                  <IonCol>
                    <IonText className="headingBoldText">{`${t("management.transportDetail.bridgesToSupervise")} (${routeBridges.length})`}</IonText>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                  <IonCol>
                    <BridgeGrid
                      supervisors={supervisors}
                      permit={permit}
                      modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                      setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
                    />
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonGrid>
        </IonCol>
      </IonRow>

      {isEditable && (
        <IonRow className="ion-margin ion-justify-content-end">
          {!!routeTransportId && routeTransportId > 0 && (
            <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
              <IonButton
                color="tertiary"
                expand="block"
                size="large"
                disabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption}
                onClick={deleteRouteTransportDetail}
              >
                <IonText>{t("management.transportDetail.buttons.deleteTransport")}</IonText>
              </IonButton>
            </IonCol>
          )}
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton
              color="secondary"
              expand="block"
              size="large"
              disabled={isSendingTransportUpdate || isDeletingTransport}
              onClick={() => history.goBack()}
            >
              <IonText>{t("common.buttons.cancel")}</IonText>
            </IonButton>
          </IonCol>
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton
              color="primary"
              expand="block"
              size="large"
              disabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption || !selectedVehicle}
              onClick={() => validateSupervisionsAndSave()}
            >
              <IonText>{t("common.buttons.save")}</IonText>
            </IonButton>
          </IonCol>
        </IonRow>
      )}

      {!isEditable && (
        <IonRow className="ion-margin ion-justify-content-end">
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton
              color="primary"
              expand="block"
              size="large"
              disabled={isSendingTransportUpdate || isDeletingTransport}
              onClick={() => history.goBack()}
            >
              <IonText>{t("common.buttons.back2")}</IonText>
            </IonButton>
          </IonCol>
        </IonRow>
      )}
      <IonPopover className="large-popover" isOpen={supervisionTimesAlertOpen} onDidDismiss={() => setSupervisionTimesAlertOpen(false)}>
        <SupervisionTimesAlert setOpen={setSupervisionTimesAlertOpen} />
      </IonPopover>
    </IonGrid>
  );
};

export default RouteTransportInfo;
