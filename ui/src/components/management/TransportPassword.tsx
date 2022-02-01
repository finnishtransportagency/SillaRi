import React from "react";
import { useTranslation } from "react-i18next";
import { UseMutationResult } from "react-query";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonText, useIonAlert } from "@ionic/react";
import IRouteTransport from "../../interfaces/IRouteTransport";
import IRouteTransportPassword from "../../interfaces/IRouteTransportPassword";
import close from "../../theme/icons/close.svg";
import { isTransportEditable } from "../../utils/validation";
import IPermit from "../../interfaces/IPermit";

interface TransportPasswordProps {
  routeTransportId: number;
  permit: IPermit;
  modifiedRouteTransportDetail: IRouteTransport;
  isSendingTransportUpdate: boolean;
  routeTransportPasswordMutation: UseMutationResult<IRouteTransportPassword, string, number, unknown>;
  dismissPassword: () => void;
}

const TransportPassword = ({
  routeTransportId,
  permit,
  modifiedRouteTransportDetail,
  isSendingTransportUpdate,
  routeTransportPasswordMutation,
  dismissPassword,
}: TransportPasswordProps): JSX.Element => {
  const { t } = useTranslation();
  const [present] = useIonAlert();

  const { currentTransportPassword } = modifiedRouteTransportDetail || {};
  const { transportPassword = "" } = currentTransportPassword || {};

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
    <IonGrid className="ion-margin ion-no-padding">
      <IonRow>
        <IonCol size="10" className="ion-text-center">
          {transportPassword.length > 0 && <IonText className="headingText">{transportPassword}</IonText>}
          {transportPassword.length === 0 && <IonText>{`(${t("management.transportDetail.passwordUnknown")})`}</IonText>}
        </IonCol>
        <IonCol size="2">
          <IonIcon
            className="otherIcon"
            icon={close}
            onClick={() => {
              dismissPassword();
            }}
          />
        </IonCol>
      </IonRow>
      <IonRow>
        <IonCol size="10" className="ion-text-center">
          {isTransportEditable(modifiedRouteTransportDetail, permit) && transportPassword.length > 0 && (
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
  );
};

export default TransportPassword;
