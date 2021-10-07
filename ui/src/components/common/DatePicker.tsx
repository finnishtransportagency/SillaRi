import React from "react";
import { useTranslation } from "react-i18next";
import { IonDatetime, IonIcon, IonItem } from "@ionic/react";
import { calendarOutline } from "ionicons/icons";
import moment from "moment";
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
        displayFormat="DD.MM.YYYY"
        doneText={t("common.buttons.done")}
        cancelText={t("common.buttons.back")}
        value={moment(value).toISOString()}
        min={minYear}
        max={maxYear}
        onIonChange={(e) => onChange(moment(e.detail.value).toDate())}
      />
      <IonIcon className="openIcon" icon={calendarOutline} slot="end" />
    </IonItem>
  );
};

DatePicker.defaultProps = {
  className: undefined,
};

export default DatePicker;
