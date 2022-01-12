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

const DatePicker = ({ value, onChange }: DatePickerProps): JSX.Element => {
  const min = moment().toDate();
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
    />
  );
};

DatePicker.defaultProps = {
  className: undefined,
};

export default DatePicker;
