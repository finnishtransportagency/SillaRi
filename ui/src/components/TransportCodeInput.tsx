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
      <IonRow className="ion-margin-horizontal ion-margin-bottom ion-align-items-end">
        <IonCol size="6" size-md="4" size-lg="3" className="ion-margin-end">
          <IonLabel className="headingText">
            <small>{t("transports.transportCodeInput.inputLabel")}</small>
          </IonLabel>
          <IonInput
            className="small-margin-top"
            type="password"
            value={codeInputValue}
            placeholder={t("transports.transportCodeInput.inputPlaceholder")}
            onIonChange={(event) => {
              setCodeValue(event.detail.value);
            }}
            clearInput
          />
        </IonCol>
        <IonCol size="5" size-md="3" size-lg="2">
          <IonButton color="primary" expand="block" size="default" disabled={!codeInputValue} onClick={submitPassword}>
            {t("common.buttons.search")}
          </IonButton>
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
