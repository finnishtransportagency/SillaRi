import React from "react";
import moment from "moment";
import CustomSelect from "./CustomSelect";
import "./DatePicker.css";

interface DatePickerProps {
  value: Date;
  onChange: (value: Date) => void;
  usePortal?: boolean;
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
    // Allow the user to enter numbers, and add the separators automatically if missing
    // The select dropdown filter will determine the final value, so no need to do date validation
    const dotRegex = /\./g;
    const dots = inputValue.match(dotRegex);
    const firstDot = inputValue.indexOf(".");

    // If the value contains the day and month, add a separator then the year, then return if valid
    const testValue1 =
      inputValue.length >= 6 && dots && dots.length === 1
        ? `${inputValue.substring(0, firstDot)}.${inputValue.substring(firstDot + 1, firstDot + 3)}.${inputValue.substring(firstDot + 3)}`
        : inputValue;
    const regex1 = /^\d{1,2}\.\d{1,2}\.?\d{0,4}$/g;

    if (testValue1.match(regex1)) {
      return testValue1;
    } else {
      // If the value contains only the day, add a separator then the month, then return if valid, otherwise just return the input
      const testValue2 = inputValue.length >= 3 && !dots ? `${inputValue.substring(0, 2)}.${inputValue.substring(2)}` : inputValue;
      const regex2 = /^\d{1,2}\.?\d{0,2}$/g;
      return testValue2.match(regex2) ? testValue2 : prevInputValue;
    }
  }
};

const DatePicker = ({ value, onChange, usePortal }: DatePickerProps): JSX.Element => {
  const min = moment(value).isBefore(moment()) ? value : moment().toDate();
  const max = moment().add(100, "days").toDate();
  return (
    <CustomSelect
      options={getDaysArray(min, max).map((date) => {
        return { value: moment(date).format("YYYY-MM-DD"), label: moment(date).format("D.M.YYYY") };
      })}
      selectedValue={moment(value).format("YYYY-MM-DD")}
      onChange={(date) => {
        onChange(moment(date).toDate());
      }}
      validateInput={validateInput}
      usePortal={usePortal}
    />
  );
};

DatePicker.defaultProps = {
  className: undefined,
};

export default DatePicker;
