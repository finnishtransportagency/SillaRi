import React from "react";
import moment from "moment";
import CustomSelect from "./CustomSelect";
import "./TimePicker.css";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  hasError: boolean;
}

const getMinutesArray = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setMinutes(dt.getMinutes() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

const validateInput = (inputValue: string, prevInputValue: string) => {
  if (!inputValue || inputValue.length === 0) {
    return "";
  } else {
    // Check that the input value matches the format in the dropdown
    // Allow the user to enter numbers, and add the separator automatically if missing
    // The select dropdown filter will determine the final value, so no need to do time validation
    const testValue = inputValue.length >= 3 && inputValue.indexOf(":") < 0 ? `${inputValue.substring(0, 2)}:${inputValue.substring(2)}` : inputValue;
    const regex = /^\d{1,2}:?\d{0,2}$/g;
    return testValue.match(regex) ? testValue : prevInputValue;
  }
};

const TimePicker = ({ value, onChange, hasError }: TimePickerProps): JSX.Element => {
  const min = moment(value).startOf("day").toDate();
  const max = moment(value).endOf("day").toDate();
  return (
    <CustomSelect
      options={getMinutesArray(min, max).map((date) => {
        return { value: moment(date).format("YYYY-MM-DD HH:mm"), label: moment(date).format("HH:mm") };
      })}
      selectedValue={moment(value).format("YYYY-MM-DD HH:mm")}
      onChange={(date) => {
        onChange(moment(date).toDate());
      }}
      validateInput={validateInput}
      hasError={hasError}
    />
  );
};

TimePicker.defaultProps = {
  className: undefined,
};

export default TimePicker;
