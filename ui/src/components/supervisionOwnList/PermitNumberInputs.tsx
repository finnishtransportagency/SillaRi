import React, { useEffect, useState } from "react";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonToast } from "@ionic/react";
import { useTranslation } from "react-i18next";
import PermitNumberInput from "./PermitNumberInput";
import { getPermitRoutes } from "../../utils/areaContractorBackendData";
import { useDispatch } from "react-redux";
import OwnListPermitRouteType from "./OwnListPermitRouteType";
import add from "../../theme/icons/add.svg";
import arrowRight from "../../theme/icons/arrow-right.svg";
import { RootState, useTypedSelector } from "../../store/store";

interface PermitNumberInputsProps {
  permitRoutes: Array<OwnListPermitRouteType>;
  cancel: () => void;
  toNextPhase: (permitRoutes: Array<OwnListPermitRouteType>) => void;
}

const PermitNumberInputs = ({ permitRoutes, cancel, toNextPhase }: PermitNumberInputsProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [permitNumbers, setPermitNumbers] = useState<Array<string>>(permitRoutes.length ? permitRoutes.map((pr) => pr.permitNumber) : Array(""));
  const [errorCode, setErrorCode] = useState<string>("");

  const setPermitNumber = (index: number, value: string) => {
    permitNumbers[index] = value;
  };

  const addPermitNumber = () => {
    permitNumbers.push("");
    setPermitNumbers([...permitNumbers]);
  };

  const {
    networkStatus: { isFailed = {}, failedStatus = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  useEffect(() => {
    setErrorCode("");
    console.log(failedStatus.getPermitRoutes);
    if (failedStatus.getPermitRoutes) {
      if (failedStatus.getPermitRoutes === 404) {
        setErrorCode(t("supervisionOwnList.addModal.permitNumberInput.notFound"));
      } else if (failedStatus.getPermitRoutes === 403) {
        setErrorCode(t("supervisionOwnList.addModal.permitNumberInput.noRights"));
      }
    }
  }, [failedStatus.getPermitRoutes]);

  const getPermits = async () => {
    permitRoutes = [];
    for (let i = 0; i < permitNumbers.length; i++) {
      if (permitNumbers[i].length > 0) {
        try {
          const routes = await getPermitRoutes(permitNumbers[i], dispatch);
          permitRoutes.push({ permitNumber: permitNumbers[i], routes: routes, selectedRouteIndex: null });
          setErrorCode("");
        } catch (err) {
          console.error(err);
        }
      }
    }
    if (permitRoutes.length > 0) {
      toNextPhase(permitRoutes);
    }
  };

  return (
    <>
      {permitNumbers.map((permitNumber, i) => (
        <PermitNumberInput key={i} index={i} initialValue={permitNumber} onChange={setPermitNumber} />
      ))}

      <IonButton onClick={() => addPermitNumber()} border-width="0px" fill="clear" color-contrast="primary">
        <IonIcon className="otherIcon" icon={add} />
        {t("supervisionOwnList.addModal.permitNumberInput.addPermitNumberButtonLabel")}{" "}
      </IonButton>

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol class="ion-button ion-float-left">
            <IonButton onClick={cancel} color="secondary">
              {t("supervisionOwnList.addModal.permitNumberInput.cancelButtonLabel")}
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton class="ion-button ion-float-right" onClick={getPermits}>
              {t("supervisionOwnList.addModal.permitNumberInput.continueButtonLabel")}
              <IonIcon className="otherIcon" icon={arrowRight} />
            </IonButton>
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonToast
        isOpen={errorCode.length > 0}
        message={errorCode}
        onDidDismiss={() => setErrorCode("")}
        duration={5000}
        position="top"
        color="success"
      />
    </>
  );
};

export default PermitNumberInputs;
