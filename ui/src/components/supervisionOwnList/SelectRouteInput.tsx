import React, { useState } from "react";
import "./OwnListAddModal.css";
import CustomSelect from "../common/CustomSelect";
import IRoute from "../../interfaces/IRoute";

interface SelectRouteInputProps {
  permitIndex: number;
  routes: Array<IRoute>;
  selectedRouteIndex: number | null;
  onChange: (permitIndex: number, routeIndex: number) => void;
}

const SelectRouteInput = ({ permitIndex, routes, selectedRouteIndex, onChange }: SelectRouteInputProps): JSX.Element => {
  const [localSelectedRouteIndex, setLocalSelectedRouteIndex] = useState<string | number | undefined>(
    selectedRouteIndex === null ? undefined : selectedRouteIndex
  );

  const setSelectedRouteIndex = (selectedIndex: string | number | undefined) => {
    setLocalSelectedRouteIndex(selectedIndex);
    onChange(permitIndex, selectedIndex as number);
  };

  const getOptions = () => {
    const options: Array<{ value: number; label: string }> = [];
    routes.forEach((route, i) => {
      options.push({ value: i, label: route.name });
    });
    return options;
  };

  return (
    <>
      <CustomSelect options={getOptions()} selectedValue={localSelectedRouteIndex} onChange={setSelectedRouteIndex} />
    </>
  );
};

export default SelectRouteInput;
