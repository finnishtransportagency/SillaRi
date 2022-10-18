import React from "react";
import "./OwnListAddModal.css";
import CustomSelect from "../common/CustomSelect";
import IRoute from "../../interfaces/IRoute";

interface SelectRouteInputProps {
  index: number;
  routes: Array<IRoute>;
  selectedRouteIndex: number | null;
  onChange: (index: number, routeIndex: number) => void;
}

const SelectRouteInput = ({ index, routes, selectedRouteIndex, onChange }: SelectRouteInputProps): JSX.Element => {
  const setSelectedRouteIndex = (selectedIndex: string | number | undefined) => {
    onChange(index, selectedIndex as number);
  };

  const getOptions = () => {
    const options: Array<{ value: number; label: string }> = [];
    routes.forEach((route, i) => {
      options.push({ value: i, label: route.name });
    });
    return options;
  };

  const getSelectedIndex = () => {
    return selectedRouteIndex === null ? undefined : selectedRouteIndex;
  };

  return (
    <>
      <CustomSelect options={getOptions()} selectedValue={getSelectedIndex()} onChange={setSelectedRouteIndex} />
    </>
  );
};

export default SelectRouteInput;
