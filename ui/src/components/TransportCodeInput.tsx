import React, { Dispatch, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonInput, IonLabel, IonRow, IonText } from "@ionic/react";

interface TransportCodeInputProps {
  codeInputValue: string;
  setCodeInputValue: Dispatch<SetStateAction<string>>;
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
  submitPassword: () => void;
}

const TransportCodeInput = ({
  codeInputValue,
  setCodeInputValue,
  errorMessage,
  setErrorMessage,
  submitPassword,
}: TransportCodeInputProps): JSX.Element => {
  const { t } = useTranslation();

  const setCodeValue = (value: string | null | undefined) => {
    if (!value) {
      value = "";
    }
    setCodeInputValue(value.toUpperCase());
    setErrorMessage("");
  };

  return (
    <>
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
                    setCodeValue(event.detail.value);
                  }}
                  clearInput
                />
              </IonCol>
            </IonRow>
            <IonRow className="ion-margin">
              <IonCol size="12" size-sm="4">
                <IonButton color="primary" expand="block" size="large" disabled={!codeInputValue} onClick={submitPassword}>
                  {t("common.buttons.search")}
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      {errorMessage && (
        <IonRow>
          <IonCol size="12" className="whiteBackground">
            <IonGrid className="ion-no-padding">
              <IonRow className="ion-margin">
                <IonCol size="12">
                  <IonText color="danger">{errorMessage}</IonText>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      )}
    </>
  );
};

export default TransportCodeInput;
