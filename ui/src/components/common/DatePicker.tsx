import React from "react";
import { useTranslation } from "react-i18next";
import { IonDatetime, IonIcon, IonItem } from "@ionic/react";
import moment from "moment";
import calendar from "../../theme/icons/calendar.svg";
import "./DatePicker.css";

interface DatePickerProps {
  className?: string;
  value: Date;
  onChange: (value: Date) => void;
}

const DatePicker = ({ className, value, onChange }: DatePickerProps): JSX.Element => {
  const { t } = useTranslation();
  const minYear = moment().format("YYYY");
  const maxYear = moment().add(3, "years").format("YYYY");

  return (
    <IonItem lines="none" className={`datePicker ${className || ""}`}>
      <IonDatetime
        doneText={t("common.buttons.done")}
        cancelText={t("common.buttons.back")}
        value={moment(value).toISOString()}
        min={minYear}
        max={maxYear}
        onIonChange={(e) => onChange(moment(e.detail.value).toDate())}
      />
      <IonIcon className="otherIcon openIcon" icon={calendar} slot="end" />
    </IonItem>
  );
};

DatePicker.defaultProps = {
  className: undefined,
};

export default DatePicker;
