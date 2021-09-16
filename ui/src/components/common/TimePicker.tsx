import React from "react";
import { useTranslation } from "react-i18next";
import { IonDatetime, IonIcon, IonItem } from "@ionic/react";
import { timeOutline } from "ionicons/icons";
import moment from "moment";
import "./TimePicker.css";

interface TimePickerProps {
  className?: string;
  value: Date;
}

const TimePicker = ({ className, value }: TimePickerProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <IonItem lines="none" className={`timePicker ${className || ""}`}>
      <IonDatetime
        displayFormat="HH:mm"
        doneText={t("common.buttons.done")}
        cancelText={t("common.buttons.back")}
        value={moment(value).toISOString()}
      />
      <IonIcon className="openIcon" icon={timeOutline} slot="end" />
    </IonItem>
  );
};

TimePicker.defaultProps = {
  className: undefined,
};

export default TimePicker;
