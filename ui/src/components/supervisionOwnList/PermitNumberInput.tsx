import React from "react";
import { IonInput, IonLabel } from "@ionic/react";
import "./OwnListAddModal.css";
import { useTranslation } from "react-i18next";

interface PermitNumberInputProps {
  index: number;
  initialValue: string;
  onChange: (index: number, permitNumber: string) => void;
}

const PermitNumberInput = ({ index, initialValue, onChange }: PermitNumberInputProps): JSX.Element => {
  const { t } = useTranslation();

  const setCodeValue = (value: string | null | undefined) => {
    if (!value) {
      value = "";
    }
    onChange(index, value);
  };

  return (
    <>
      <IonLabel className="headingText">
        <small>{t("supervisionOwnList.addModal.permitNumberInput.inputLabel")}</small>
      </IonLabel>
      <IonInput
        className="small-margin-top"
        type="text"
        value={initialValue}
        onIonChange={(event) => {
          setCodeValue(event.detail.value);
        }}
        clearInput
      />
    </>
  );
};

export default PermitNumberInput;
