import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonItemDivider, IonRow, IonText } from "@ionic/react";
import moment from "moment";
import IPermit from "../../interfaces/IPermit";
import IRouteTransport from "../../interfaces/IRouteTransport";
import ISupervisor from "../../interfaces/ISupervisor";
import { useTypedSelector } from "../../store/store";
import { onRetry, sendRouteTransportPlanned, sendRouteTransportUpdate } from "../../utils/managementBackendData";
import { DATE_FORMAT } from "../../utils/constants";
import BridgeGrid from "./BridgeGrid";
import RouteInfoGrid from "./RouteInfoGrid";
import TransportInfoAccordion from "./TransportInfoAccordion";

interface RouteTransportInfoProps {
  permit: IPermit;
  supervisors: ISupervisor[];
  setToastMessage: Dispatch<SetStateAction<string>>;
}

const RouteTransportInfo = ({ permit, supervisors, setToastMessage }: RouteTransportInfoProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);
  const { modifiedRouteTransportDetail, selectedRouteOption, isRouteTransportModified } = management;

  const { companyId, permitNumber, validStartDate, validEndDate, routes = [] } = permit || {};
  const { id: routeTransportId } = modifiedRouteTransportDetail || {};

  // Set-up mutations for modifying data later
  const routeTransportPlannedMutation = useMutation((transport: IRouteTransport) => sendRouteTransportPlanned(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      setToastMessage(t("management.addTransport.saved"));
    },
  });
  const routeTransportUpdateMutation = useMutation((transport: IRouteTransport) => sendRouteTransportUpdate(transport, dispatch), {
    retry: onRetry,
    onSuccess: () => {
      setToastMessage(t("management.addTransport.saved"));
    },
  });

  const { isLoading: isSendingTransportUpdate } = routeTransportUpdateMutation;

  const saveRouteTransport = () => {
    if (!!routeTransportId && routeTransportId > 0) {
      routeTransportUpdateMutation.mutate(modifiedRouteTransportDetail as IRouteTransport);
    } else {
      routeTransportPlannedMutation.mutate(modifiedRouteTransportDetail as IRouteTransport);
    }
  };

  return (
    <IonGrid className="ion-no-padding" fixed>
      <IonRow>
        <IonCol className="whiteBackground">
          <IonGrid className="ion-no-padding">
            <IonRow className="ion-margin-top ion-margin-start ion-margin-end">
              <IonCol size="12" size-sm="4" size-lg="2">
                <IonText className="headingText">{t("management.addTransport.transportPermit")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="2">
                <IonText>{permitNumber}</IonText>
              </IonCol>

              <IonCol size="12" size-sm="4" size-lg="2">
                <IonText className="headingText">{t("management.addTransport.validityPeriod")}</IonText>
              </IonCol>
              <IonCol size="12" size-sm="8" size-lg="3">
                <IonText>{`${moment(validStartDate).format(DATE_FORMAT)} - ${moment(validEndDate).format(DATE_FORMAT)}`}</IonText>
              </IonCol>

              {!!routeTransportId && routeTransportId > 0 && (
                <>
                  <IonCol size="12" size-sm="4" size-lg="2">
                    <IonText className="headingText">{t("management.addTransport.transportId")}</IonText>
                  </IonCol>
                  <IonCol size="12" size-sm="8" size-lg="1">
                    <IonText>{routeTransportId}</IonText>
                  </IonCol>
                </>
              )}
            </IonRow>

            <IonItemDivider />

            <IonRow className="ion-margin">
              <IonCol>
                <IonText className="headingText">{t("management.addTransport.transportInformation")}</IonText>
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol>
                <RouteInfoGrid permitRoutes={routes} />
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
                    <BridgeGrid supervisors={supervisors} />
                  </IonCol>
                </IonRow>
              </>
            )}
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="ion-margin ion-justify-content-end">
        {!!routeTransportId && routeTransportId > 0 && (
          <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
            <IonButton color="tertiary" disabled>
              <IonText>{t("management.addTransport.buttons.deleteTransport")}</IonText>
            </IonButton>
          </IonCol>
        )}
        <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
          <IonButton color="secondary" routerLink={`/management/${companyId}`}>
            <IonText>{t("common.buttons.cancel")}</IonText>
          </IonButton>
        </IonCol>
        <IonCol size="12" size-sm className="ion-padding-start ion-padding-bottom ion-text-center">
          <IonButton color="primary" disabled={isSendingTransportUpdate || !isRouteTransportModified} onClick={saveRouteTransport}>
            <IonText>{t("common.buttons.save")}</IonText>
          </IonButton>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default RouteTransportInfo;
