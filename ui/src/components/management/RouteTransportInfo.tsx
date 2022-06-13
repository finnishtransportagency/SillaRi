import React, { Dispatch, MouseEvent, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonItemDivider, IonPopover, IonRow, IonText, IonToast, useIonAlert, useIonPopover } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRoute from "../../interfaces/IRoute";
import IRouteTransport from "../../interfaces/IRouteTransport";
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
import SupervisionTimesAlert from "./SupervisionTimesAlert";
import NoNetworkNoData from "../NoNetworkNoData";
import Loading from "../Loading";
import RouteTransportFooter from "./RouteTransportFooter";
import SupervisionReport from "./SupervisionReport";
import IToastMessage from "../../interfaces/IToastMessage";

interface RouteTransportInfoProps {
  routeTransportId: number;
  permit: IPermit;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  selectedRouteOption: IRoute;
  setSelectedRouteOption: Dispatch<SetStateAction<IRoute | undefined>>;
  selectedVehicle: IVehicle | undefined;
  setSelectedVehicle: Dispatch<SetStateAction<IVehicle | undefined>>;
  toastMessage: IToastMessage;
  setToastMessage: Dispatch<SetStateAction<IToastMessage>>;
  noNetworkNoData: boolean;
  notReady: boolean;
}

const RouteTransportInfo = ({
  routeTransportId,
  permit,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
  selectedRouteOption,
  setSelectedRouteOption,
  selectedVehicle,
  setSelectedVehicle,
  toastMessage,
  setToastMessage,
  noNetworkNoData,
  notReady,
}: RouteTransportInfoProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const queryClient = useQueryClient();
  const [present] = useIonAlert();
  const [supervisionTimesAlertOpen, setSupervisionTimesAlertOpen] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState<boolean>(false);
  const [selectedSupervisionId, setSelectedSupervisionId] = useState<number | undefined>(undefined);

  const { validStartDate, validEndDate } = permit || {};
  const { plannedDepartureTime, supervisions = [] } = modifiedRouteTransportDetail || {};

  const isEditable = isTransportEditable(modifiedRouteTransportDetail, permit);

  // Set-up mutations for modifying data later
  const routeTransportPlannedMutation = useMutation((transport: IRouteTransport) => createRouteTransport(transport, dispatch), {
    retry: false,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage({ message: t("management.transportDetail.saved"), color: "" });

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace("/management");
    },
    onError: (error) => {
      let errorMessage;
      if (error instanceof Error && error.message === "409") {
        errorMessage = t("management.transportDetail.error.transportNumberConflict");
      } else {
        errorMessage = t("common.error");
      }
      setToastMessage({ message: errorMessage, color: "danger" });
    },
  });

  const routeTransportUpdateMutation = useMutation((transport: IRouteTransport) => updateRouteTransport(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage({ message: t("management.transportDetail.saved"), color: "" });

      // Invalidate the route transport data in RouteGrid.tsx to force the grid to update when going back to that page with history.replace
      queryClient.invalidateQueries("getRouteTransportsOfPermit");
      history.replace("/management");
    },
  });

  const routeTransportDeleteMutation = useMutation((routeTransportIdToDelete: number) => deleteRouteTransport(routeTransportIdToDelete, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      // TODO - move toast to avoid error?
      setToastMessage({ message: t("management.transportDetail.deleted"), color: "" });

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
      const { supervisions: updatedSupervisions = [] } = modifiedRouteTransportDetail;

      // Clear previous supervision status and let backend handle it
      const newSupervisions = updatedSupervisions.map((s) => {
        return { ...s, currentStatus: undefined };
      });
      routeTransportUpdateMutation.mutate({
        ...modifiedRouteTransportDetail,
        currentStatus: undefined,
        currentTransportPassword: undefined,
        supervisions: newSupervisions,
      });
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
    <>
      <IonContent color="light">
        {notReady ? (
          noNetworkNoData ? (
            <NoNetworkNoData />
          ) : (
            <Loading />
          )
        ) : (
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

                  <IonRow className="ion-margin">
                    <IonCol size="8" size-sm="4" size-lg="3" size-xl="2">
                      <IonText className="headingText">{t("management.transportDetail.password")}</IonText>
                    </IonCol>
                    {!!routeTransportId && routeTransportId > 0 ? (
                      <IonCol size="4" size-sm="8" size-lg="9" size-xl="10">
                        <IonText className="linkText" onClick={(evt) => showPassword(evt)}>
                          {t("management.companySummary.action.show")}
                        </IonText>
                      </IonCol>
                    ) : (
                      <IonCol>
                        <IonText>{t("management.transportDetail.passwordNotGenerated")}</IonText>
                      </IonCol>
                    )}
                  </IonRow>

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

                  {selectedRouteOption && (
                    <>
                      <IonRow className="ion-margin">
                        <IonCol>
                          <IonText className="headingBoldText">{`${t("management.transportDetail.bridgesToSupervise")} (${
                            supervisions.length
                          })`}</IonText>
                        </IonCol>
                      </IonRow>
                      <IonRow className="ion-margin">
                        <IonCol>
                          {supervisions.length > 0 ? (
                            <BridgeGrid
                              modifiedRouteTransportDetail={modifiedRouteTransportDetail}
                              setModifiedRouteTransportDetail={setModifiedRouteTransportDetail}
                              setReportModalOpen={setReportModalOpen}
                              setSelectedSupervisionId={setSelectedSupervisionId}
                              isEditable={isEditable}
                            />
                          ) : (
                            <IonText>{t("management.transportDetail.bridgeInfo.noBridges")}</IonText>
                          )}
                        </IonCol>
                      </IonRow>
                    </>
                  )}
                </IonGrid>
              </IonCol>
            </IonRow>

            <IonPopover className="large-popover" isOpen={supervisionTimesAlertOpen} onDidDismiss={() => setSupervisionTimesAlertOpen(false)}>
              <SupervisionTimesAlert setOpen={setSupervisionTimesAlertOpen} />
            </IonPopover>
          </IonGrid>
        )}
        <IonToast
          isOpen={toastMessage.message.length > 0}
          message={toastMessage.message}
          onDidDismiss={() => setToastMessage({ message: "", color: "" })}
          duration={5000}
          position="top"
          color={toastMessage.color ? toastMessage.color : "success"}
        />
        <SupervisionReport
          isOpen={reportModalOpen}
          setOpen={setReportModalOpen}
          selectedSupervisionId={selectedSupervisionId}
          setSelectedSupervisionId={setSelectedSupervisionId}
        />
      </IonContent>
      <RouteTransportFooter
        isEditable={isEditable}
        routeTransportId={routeTransportId}
        deleteTransport={deleteRouteTransportDetail}
        saveTransport={validateSupervisionsAndSave}
        deleteDisabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption}
        cancelDisabled={isSendingTransportUpdate || isDeletingTransport}
        saveDisabled={isSendingTransportUpdate || isDeletingTransport || !selectedRouteOption || !selectedVehicle || !plannedDepartureTime}
      />
    </>
  );
};

export default RouteTransportInfo;
