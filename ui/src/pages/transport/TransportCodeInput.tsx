import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonContent, IonInput, IonPage } from "@ionic/react";
import Header from "../../components/Header";
import { useHistory } from "react-router";
import { findRouteTransportPassword } from "../../utils/managementBackendData";
import { useDispatch } from "react-redux";

const TransportCodeForm = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const [codeInputValue, setCodeInputValue] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const setCodeValue = (value: string) => {
    setCodeInputValue(value.toUpperCase());
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    if (codeInputValue.length > 0) {
      const routeTransportPassword = await findRouteTransportPassword(codeInputValue, dispatch);

      if (routeTransportPassword.routeTransportId) {
        setErrorMsg("");
        history.push(`/transport/${routeTransportPassword.routeTransportId}`);
      } else {
        setErrorMsg(t("transports.transportCodeInput.invalidCodeErrorMessage"));
      }
    }
  };

  return (
    <IonPage>
      <Header title={t("transports.transportCodeInput.header.title")} />
      <IonContent class="ion-padding" color="light">
        <h3>{t("transports.transportCodeInput.inputLabel")}</h3>
        <form
          name="codeInputForm"
          onSubmit={(event) => {
            event.preventDefault();
            (event.target as HTMLFormElement).reset();
            handleSubmit();
          }}
        >
          <IonInput
            type="password"
            name="code"
            value={codeInputValue}
            placeholder={t("transports.transportCodeInput.inputPlaceholder")}
            onIonChange={(event) => {
              setCodeValue((event.target as HTMLInputElement).value);
            }}
            clearInput
            show-hide-input
          />
          <IonButton type="submit">{t("transports.transportCodeInput.submitButtonLabel")}</IonButton>
        </form>
        {errorMsg ? <div>{errorMsg}</div> : <div></div>}
      </IonContent>
    </IonPage>
  );
};

export default TransportCodeForm;
