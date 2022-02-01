import ISupervisor from "../../interfaces/ISupervisor";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonLabel, IonRow, IonText } from "@ionic/react";
import React, { Dispatch, SetStateAction, useState } from "react";
import SupervisorSelect from "./SupervisorSelect";
import IRouteTransport from "../../interfaces/IRouteTransport";

interface MultiSupervisorsSelectionProps {
  supervisors: ISupervisor[];
  modifiedRouteTransportDetail: IRouteTransport;
  setModifiedRouteTransportDetail: Dispatch<SetStateAction<IRouteTransport | undefined>>;
}

const MultiSupervisorsSelection = ({
  supervisors,
  modifiedRouteTransportDetail,
  setModifiedRouteTransportDetail,
}: MultiSupervisorsSelectionProps): JSX.Element => {
  const { t } = useTranslation();

  const [selectedSupervisor1, setSelectedSupervisor1] = useState<ISupervisor | undefined>(undefined);
  const [selectedSupervisor2, setSelectedSupervisor2] = useState<ISupervisor | undefined>(undefined);

  const setSupervisor = (priority: number, supervisorId: number) => {
    if (priority === 1) {
      const supervisor1 = supervisors.find((s) => s.id === supervisorId) as ISupervisor;
      setSelectedSupervisor1({ ...supervisor1, priority: 1 });
    } else if (priority === 2) {
      const supervisor2 = supervisors.find((s) => s.id === supervisorId) as ISupervisor;
      setSelectedSupervisor2({ ...supervisor2, priority: 2 });
    }
  };

  const addOrReplaceSupervisor = (
    currentSupervisors: ISupervisor[],
    selectedSupervisor: ISupervisor | undefined,
    priority: number
  ): ISupervisor | undefined => {
    // If the new supervisor is not selected from dropdown, do not replace existing supervisors with the empty one.
    // This might happen when 1.supervisor is selected, but 2.supervisor left empty.
    const currentSupervisor = currentSupervisors.find((s) => s.priority === priority);
    return selectedSupervisor !== undefined ? selectedSupervisor : currentSupervisor;
  };

  const setSupervisorsToAllBridges = () => {
    const { supervisions: currentSupervisions = [] } = modifiedRouteTransportDetail || {};

    const newSupervisions = currentSupervisions.map((supervision) => {
      const { supervisors: currentSupervisors = [] } = supervision || {};

      // If a supervisor is undefined, don't include it in the supervisors array, otherwise the backend throws a not-null constraint violation
      const newSupervisor1 = addOrReplaceSupervisor(currentSupervisors, selectedSupervisor1, 1);
      const newSupervisor2 = addOrReplaceSupervisor(currentSupervisors, selectedSupervisor2, 2);
      const newSupervisors: ISupervisor[] = [...(newSupervisor1 ? [newSupervisor1] : []), ...(newSupervisor2 ? [newSupervisor2] : [])];
      return { ...supervision, supervisors: newSupervisors };
    });

    const newRouteTransport: IRouteTransport = { ...modifiedRouteTransportDetail, supervisions: newSupervisions };
    setModifiedRouteTransportDetail(newRouteTransport);
  };

  return (
    <>
      <IonRow className="ion-margin">
        <IonCol>
          <IonText className="headingBoldText">{t("management.transportDetail.bridgeInfo.bridgeSupervisors")}</IonText>
        </IonCol>
      </IonRow>
      <IonRow className="ion-margin">
        <IonCol size-lg="4" size-sm="5" size-xs="12" className="ion-margin-end">
          <IonRow>
            <IonCol>
              <IonLabel className="headingText">{t("management.transportDetail.bridgeInfo.supervisor1")}</IonLabel>
              <SupervisorSelect key="bridges-1" supervisors={supervisors} priority={1} value={selectedSupervisor1} setSupervisor={setSupervisor} />
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size-lg="4" size-sm="5" size-xs="12" className="ion-margin-end">
          <IonRow>
            <IonCol>
              <IonLabel className="headingText">{t("management.transportDetail.bridgeInfo.supervisor2")}</IonLabel>
              <SupervisorSelect key="bridges-2" supervisors={supervisors} priority={2} value={selectedSupervisor2} setSupervisor={setSupervisor} />
            </IonCol>
          </IonRow>
        </IonCol>
        <IonCol size-lg="auto" size-sm="5" size-xs="12" className="ion-align-self-end">
          <IonButton className="ion-margin-top" color="secondary" expand="block" onClick={() => setSupervisorsToAllBridges()}>
            {t("management.transportDetail.bridgeInfo.copySupervisor")}
          </IonButton>
        </IonCol>
      </IonRow>
    </>
  );
};

export default MultiSupervisorsSelection;