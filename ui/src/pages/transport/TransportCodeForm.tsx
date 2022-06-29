import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IonContent, IonGrid, IonPage, IonText } from "@ionic/react";
import Header from "../../components/Header";
import { useHistory } from "react-router";
import { findRouteTransportPassword } from "../../utils/transportBackendData";
import { useDispatch } from "react-redux";
import TransportCodeInput from "../../components/TransportCodeInput";

const TransportCodeForm = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [codeInputValue, setCodeInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (codeInputValue.length > 0) {
      const routeTransportPassword = await findRouteTransportPassword(codeInputValue, dispatch);

      if (routeTransportPassword.routeTransportId) {
        setErrorMsg("");
        history.push(`/transport/${encodeURIComponent(routeTransportPassword.transportPassword)}`);
      } else {
        setErrorMsg(t("transports.transportCodeInput.invalidCodeErrorMessage"));
      }
    }
  };

  return (
    <IonPage>
      <Header title={t("main.header.title")} titleStyle="headingBoldText ion-text-center" />
      <IonContent color="light">
        <div className="ion-margin">
          <IonText className="headingBoldText">{t("transports.transportCodeInput.inputTitle")}</IonText>
        </div>
        <div className="listContainer whiteBackground ion-padding-vertical">
          <IonGrid className="ion-no-padding">
            <TransportCodeInput
              codeInputValue={codeInputValue}
              setCodeInputValue={setCodeInputValue}
              errorMessage={errorMsg}
              setErrorMessage={setErrorMsg}
              submitPassword={handleSubmit}
              disabled={!codeInputValue}
            />
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TransportCodeForm;
