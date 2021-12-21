import React from "react";
import Select, { components } from "react-select";
import type { DropdownIndicatorProps } from "react-select";
import { IonIcon } from "@ionic/react";
import arrowOpen from "../../theme/icons/arrow-open.svg";

interface CustomSelectProps {
  options: { value: string | number; label: string }[];
  selectedValue?: string | number;
  onChange?: (value?: string | number) => void;
}

const DropdownIndicator = (props: DropdownIndicatorProps<{ value: string | number; label: string }, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <IonIcon className="otherIcon" icon={arrowOpen} />
    </components.DropdownIndicator>
  );
};

const CustomSelect = ({ options, selectedValue, onChange }: CustomSelectProps): JSX.Element => {
  return (
    <Select
      className="reactSelect"
      classNamePrefix="reactSelect"
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: "var(--ion-color-primary)",
          primary50: "var(--ion-color-secondary-50)",
          primary25: "var(--ion-color-light)",
        },
      })}
      styles={{
        control: (provided) => ({
          ...provided,
          borderColor: "var(--ion-color-base)",
          borderWidth: "2px",
        }),
        menu: (provided) => ({
          ...provided,
          zIndex: 999,
        }),
      }}
      components={{ DropdownIndicator }}
      options={options}
      value={options.find((option) => option.value === selectedValue)}
      placeholder=""
      onChange={(e) => onChange && onChange(e?.value)}
    ></Select>
  );
};

CustomSelect.defaultProps = {
  selectedValue: undefined,
  onChange: undefined,
};

export default CustomSelect;
