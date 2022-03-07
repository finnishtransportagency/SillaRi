import React from "react";
import CustomSelect from "../common/CustomSelect";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";

interface SupervisorSelectProps {
  supervisors: ISupervisor[];
  supervision?: ISupervision;
  priority: number;
  value?: ISupervisor;
  setSupervisor: (priority: number, supervisorId: number, supervision?: ISupervision) => void;
}

const SupervisorSelect = ({ supervisors, supervision, priority, value, setSupervisor }: SupervisorSelectProps): JSX.Element => {
  return (
    <CustomSelect
      options={supervisors.map((supervisor) => {
        const { id: supervisorId, firstName, lastName } = supervisor;
        return { value: supervisorId, label: `${firstName} ${lastName}` };
      })}
      selectedValue={value?.id}
      onChange={(supervisorId) =>
        supervision ? setSupervisor(priority, supervisorId as number, supervision) : setSupervisor(priority, supervisorId as number)
      }
    />
  );
};

export default SupervisorSelect;
