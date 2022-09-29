import React, { useState } from "react";
import { IonButton, IonCol, IonGrid, IonRow } from "@ionic/react";
import { useTranslation } from "react-i18next";
import PermitNumberInput from "./PermitNumberInput";
import { getPermitRoutes } from "../../utils/areaContractorBackendData";
import { useDispatch } from "react-redux";
import IRoute from "../../interfaces/IRoute";

interface PermitNumberInputsProps {
  cancel: () => void;
  setRoutes: (permitRoutes: Array<{ permitNumber: string; routes: Array<IRoute> }>) => void;
}

const PermitNumberInputs = ({ cancel, setRoutes }: PermitNumberInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [permitNumbers, setPermitNumbers] = useState<Array<string>>(Array(""));

  const setPermitNumber = (index: number, value: string) => {
    permitNumbers[index] = value;
  };

  const addPermitNumber = () => {
    permitNumbers.push("");
    setPermitNumbers([...permitNumbers]);
  };

  const getPermits = async () => {
    const permitRoutes = [];
    for (let i = 0; i < permitNumbers.length; i++) {
      if (permitNumbers[i].length > 0) {
        const routes = await getPermitRoutes(permitNumbers[i], dispatch);
        permitRoutes.push({ permitNumber: permitNumbers[i], routes: routes });
      }
    }
    if (permitRoutes.length > 0) {
      setRoutes(permitRoutes);
    }
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
