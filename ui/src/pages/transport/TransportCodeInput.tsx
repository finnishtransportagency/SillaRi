import React from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonContent, IonInput, IonPage } from "@ionic/react";
import Header from "../../components/Header";
import { useHistory } from "react-router";

const TransportCodeForm = (): JSX.Element => {
  const { t } = useTranslation();

  const history = useHistory();

  const handleSubmit = () => {
    /* TODO: Fetch transport of the code entered into the form and route to that transport id
       If tranpost with that code does not exist, should give an error message to the user.
    */
    const transportId = 1;
    const url = `/transport/${transportId}`;
    history.push(url);
  };

  return (
    <IonPage>
      <Header title={t("transports.transportCodeInput.header.title")} />
      <IonContent color="light">
        <h3>{t("transports.transportCodeInput.inputLabel")}</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <IonInput name={"code"} placeholder={t("transports.transportCodeInput.inputPlaceholder")} clearInput />
          <IonButton type="submit">{t("transports.transportCodeInput.submitButtonLabel")}</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default TransportCodeForm;
