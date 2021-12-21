import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonContent, IonGrid, IonInput, IonLabel, IonPage, IonRow, IonText } from "@ionic/react";
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
      <IonContent color="light">
        <IonGrid className="ion-no-padding" fixed>
          <IonRow>
            <IonCol size="12" className="ion-padding">
              <IonText className="headingBoldText">{t("transports.transportCodeInput.inputTitle")}</IonText>
            </IonCol>
          </IonRow>

          <IonRow>
            <IonCol size="12" className="whiteBackground">
              <IonGrid className="ion-no-padding">
                <IonRow className="ion-margin">
                  <IonCol size="12">
                    <IonLabel className="headingText">{t("transports.transportCodeInput.inputLabel")}</IonLabel>
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                  <IonCol size="12" size-sm="4">
                    <IonInput
                      type="password"
                      value={codeInputValue}
                      placeholder={t("transports.transportCodeInput.inputPlaceholder")}
                      onIonChange={(event) => {
                        setCodeValue((event.target as HTMLInputElement).value);
                      }}
                      clearInput
                    />
                  </IonCol>
                </IonRow>
                <IonRow className="ion-margin">
                  <IonCol size="12" size-sm="4">
                    <IonButton color="primary" expand="block" size="large" onClick={handleSubmit}>
                      {t("common.buttons.search")}
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>

          {errorMsg && (
            <IonRow>
              <IonCol size="12" className="whiteBackground">
                <IonGrid className="ion-no-padding">
                  <IonRow className="ion-margin">
                    <IonCol size="12">
                      <IonText>{errorMsg}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          )}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default TransportCodeForm;
