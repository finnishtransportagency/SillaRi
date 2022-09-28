import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import { useTranslation } from "react-i18next";
import PermitNumberInput from "./PermitNumberInput";

interface PermitNumberInputsProps {
  cancel: () => void;
}

const PermitNumberInputs = ({ cancel }: PermitNumberInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const [permitNumbers, setPermitNumbers] = useState<Array<string>>(Array(""));

  const setPermitNumber = (index: number, value: string) => {
    permitNumbers[index] = value;
  };

  const addPermitNumber = () => {
    permitNumbers.push("");
    setPermitNumbers([...permitNumbers]);
  };

  const getPermits = async () => {
    console.log("VALIDATE PERMIT NUMBERS");
    console.log(permitNumbers);
  };

  return (
    <>
      {permitNumbers.map((permitNumber, i) => (
        <PermitNumberInput key={i} index={i} initialValue={permitNumber} onChange={setPermitNumber} />
      ))}

      <IonButton onClick={() => addPermitNumber()}>{t("supervisionOwnList.addModal.permitNumberInput.addPermitNumberButtonLabel")}</IonButton>

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol class="ion-button ion-float-left">
            <IonButton onClick={() => cancel()}>{t("supervisionOwnList.addModal.permitNumberInput.cancelButtonLabel")}</IonButton>
          </IonCol>
          <IonCol>
            <IonButton class="ion-button ion-float-right" onClick={() => getPermits()}>
              {t("supervisionOwnList.addModal.permitNumberInput.continueButtonLabel")}
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default PermitNumberInputs;
