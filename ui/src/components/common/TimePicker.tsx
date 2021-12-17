import React from "react";
import { useTranslation } from "react-i18next";
import { IonDatetime, IonItem } from "@ionic/react";
import moment from "moment";
import "./TimePicker.css";

interface TimePickerProps {
  className?: string;
  value: Date;
  onChange: (value: Date) => void;
}

const TimePicker = ({ className, value, onChange }: TimePickerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonItem lines="none" className={`timePicker ${className || ""}`}>
      <IonDatetime
        doneText={t("common.buttons.done")}
        cancelText={t("common.buttons.back")}
        value={moment(value).toISOString()}
        onIonChange={(e) => onChange(moment(e.detail.value).toDate())}
      />
    </IonItem>
  );
};

TimePicker.defaultProps = {
  className: undefined,
};

export default TimePicker;
