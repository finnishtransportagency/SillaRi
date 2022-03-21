import React from "react";
import CustomSelect from "../common/CustomSelect";
import ISupervision from "../../interfaces/ISupervision";
import ISupervisor from "../../interfaces/ISupervisor";

interface SupervisorSelectProps {
  supervisors: ISupervisor[];
  supervision?: ISupervision;
  priority: number;
  value?: ISupervisor;
  setSupervisor: (priority: number, supervisorUsername: string, supervision?: ISupervision) => void;
}

const SupervisorSelect = ({ supervisors, supervision, priority, value, setSupervisor }: SupervisorSelectProps): JSX.Element => {
  return (
    <CustomSelect
      options={supervisors.map((supervisor) => {
        const { firstName, lastName, username } = supervisor;
        return { value: username, label: `${firstName} ${lastName}` };
      })}
      selectedValue={value?.username}
      onChange={(supervisorUsername) =>
        supervision ? setSupervisor(priority, supervisorUsername as string, supervision) : setSupervisor(priority, supervisorUsername as string)
      }
    />
  );
};

export default SupervisorSelect;
