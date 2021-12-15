import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow, IonText, useIonAlert } from "@ionic/react";
import IRouteTransport from "../../interfaces/IRouteTransport";
import { TransportStatus } from "../../utils/constants";
import { onRetry } from "../../utils/backendData";
import { generateNewRouteTransportPassword } from "../../utils/managementBackendData";
import "./TransportPassword.css";

interface TransportPasswordProps {
  routeTransportId: number;
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
  isSendingTransportUpdate: boolean;
}

const TransportPassword = ({
  routeTransportId,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
  isSendingTransportUpdate,
}: TransportPasswordProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [present] = useIonAlert();

  const { currentTransportPassword, currentStatus } = modifiedRouteTransportDetail || {};
  const { transportPassword = "" } = currentTransportPassword || {};
  const { status } = currentStatus || {};

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

  const { isLoading: isGeneratingPassword } = routeTransportPasswordMutation;

  const generateRouteTransportPassword = () => {
    if (!!routeTransportId && routeTransportId > 0) {
      // Ask the user to confirm the generation
      present({
        header: t("management.transportDetail.buttons.generatePassword"),
        message: t("management.transportDetail.alert.generatePassword"),
        buttons: [{ text: t("common.answer.yes"), handler: () => routeTransportPasswordMutation.mutate(routeTransportId) }, t("common.answer.no")],
      });
    }
  };

  return (
    <IonGrid className="ion-no-padding">
      <IonRow>
        <IonCol size="12">
          <IonGrid className="transportPassword ion-padding">
            <IonRow className="ion-align-items-center">
              <IonCol>
                <IonText>{t("management.transportDetail.password")}</IonText>
              </IonCol>
              <IonCol className="ion-padding-start">
                {transportPassword.length > 0 && <IonText className="headingText">{transportPassword}</IonText>}
                {transportPassword.length === 0 && <IonText>{`(${t("management.transportDetail.passwordUnknown")})`}</IonText>}
              </IonCol>
              <IonCol>
                {status === TransportStatus.PLANNED && transportPassword.length > 0 && (
                  <IonButton
                    color="tertiary"
                    size="small"
                    disabled={isSendingTransportUpdate || isGeneratingPassword}
                    onClick={generateRouteTransportPassword}
                  >
                    <IonText>{t("management.transportDetail.buttons.generatePassword")}</IonText>
                  </IonButton>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default TransportPassword;
