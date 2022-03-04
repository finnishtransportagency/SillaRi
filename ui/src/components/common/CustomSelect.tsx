import React from "react";
import Select, { components } from "react-select";
import type { DropdownIndicatorProps, InputActionMeta, InputProps } from "react-select";
import { IonIcon } from "@ionic/react";
import arrowOpen from "../../theme/icons/arrow-open.svg";

interface CustomSelectProps {
  options: { value: string | number; label: string }[];
  selectedValue?: string | number;
  onChange?: (value?: string | number) => void;
  validateInput?: (inputValue: string, prevInputValue: string) => string;
  usePortal?: boolean;
}

const DropdownIndicator = (props: DropdownIndicatorProps<{ value: string | number; label: string }, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <IonIcon className="otherIcon" icon={arrowOpen} />
    </components.DropdownIndicator>
  );
};

const Input = (props: InputProps<{ value: string | number; label: string }, false>) => {
  // Show a numeric input keyboard on mobile devices
  return <components.Input {...props} inputMode="numeric" />;
};

const CustomSelect = ({ options, selectedValue, onChange, validateInput, usePortal }: CustomSelectProps): JSX.Element => {
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
          backgroundColor: "var(--ion-background-color)",
          borderColor: "var(--ion-color-step-150)",
          borderWidth: "2px",
        }),
        singleValue: (provided) => ({
          ...provided,
          color: "var(--ion-text-color)",
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: "var(--ion-background-color)",
          zIndex: 999,
        }),
      }}
      components={{ Input, DropdownIndicator }}
      options={options}
      value={options.find((option) => option.value === selectedValue)}
      placeholder=""
      onChange={(e) => onChange && onChange(e?.value)}
      onInputChange={(newValue: string, actionMeta: InputActionMeta) => {
        if (validateInput) {
          const { prevInputValue } = actionMeta;
          return validateInput(newValue, prevInputValue);
        }
      }}
      menuPortalTarget={usePortal ? document.body : null}
      menuPlacement={usePortal ? "bottom" : "auto"}
      menuShouldScrollIntoView={!usePortal}
    />
  );
};

CustomSelect.defaultProps = {
  selectedValue: undefined,
  onChange: undefined,
  validateInput: undefined,
};

export default CustomSelect;
