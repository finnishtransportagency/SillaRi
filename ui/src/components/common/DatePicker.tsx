import React from "react";
import moment from "moment";
import CustomSelect from "./CustomSelect";
import "./DatePicker.css";

interface DatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
}

const getDaysArray = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
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
    // The select dropdown filter will determine the final value, so no need to do date validation
    const testValue = inputValue.length >= 3 && inputValue.indexOf(".") < 0 ? `${inputValue.substring(0, 2)}.${inputValue.substring(2)}` : inputValue;
    const regex = /^\d{1,2}\.?\d{0,2}$/g;
    return testValue.match(regex) ? testValue : prevInputValue;
  }
};

const DatePicker = ({ value, onChange }: DatePickerProps): JSX.Element => {
  const min = moment(value).isBefore(moment()) ? value : moment().toDate();
  const max = moment().add(100, "days").toDate();
  return (
    <CustomSelect
      options={getDaysArray(min, max).map((date) => {
        return { value: moment(date).format("YYYY-MM-DD"), label: moment(date).format("D.M") };
      })}
      selectedValue={moment(value).format("YYYY-MM-DD")}
      onChange={(date) => {
        onChange(moment(date).toDate());
      }}
      validateInput={validateInput}
    />
  );
};

DatePicker.defaultProps = {
  className: undefined,
};

export default DatePicker;
