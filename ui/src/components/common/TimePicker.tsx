import React from "react";
import moment from "moment";
import CustomSelect from "./CustomSelect";
import "./TimePicker.css";

interface TimePickerProps {
  value: Date;
  onChange: (value: Date) => void;
}

const getMinutesArray = (start: Date, end: Date) => {
  const arr = [];
  for (let dt = new Date(start); dt <= end; dt.setMinutes(dt.getMinutes() + 1)) {
    arr.push(new Date(dt));
  }
  return arr;
};

const TimePicker = ({ value, onChange }: TimePickerProps): JSX.Element => {
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
    />
  );
};

TimePicker.defaultProps = {
  className: undefined,
};

export default TimePicker;
