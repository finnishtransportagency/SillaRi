import React from "react";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";
import { IonSelect, IonSelectOption } from "@ionic/react";
import { useTranslation } from "react-i18next";

interface SupervisorSelectProps {
  supervisors: ISupervisor[];
  supervision: ISupervision;
  priority: number;
  value?: ISupervisor;
  setSupervisor: (supervision: ISupervision, priority: number, supervisorId: number) => void;
}

const SupervisorSelect = ({ supervisors, supervision, priority, value, setSupervisor }: SupervisorSelectProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonSelect
      interface="action-sheet"
      cancelText={t("common.buttons.back")}
      value={value?.id}
      onIonChange={(e) => setSupervisor(supervision, priority, e.detail.value)}
    >
      {supervisors.map((supervisor) => {
        const { id, firstName, lastName } = supervisor;
        const key = `supervisor_${id}`;
        return (
          <IonSelectOption key={key} value={id}>
            {`${firstName} ${lastName}`}
          </IonSelectOption>
        );
      })}
    </IonSelect>
  );
};

export default SupervisorSelect;
