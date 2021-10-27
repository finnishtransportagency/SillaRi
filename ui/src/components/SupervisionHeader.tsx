import React from "react";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { IonItem, IonLabel } from "@ionic/react";
import ISupervision from "../interfaces/ISupervision";
import file from "../theme/icons/file.svg";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./SupervisionHeader.css";

interface SupervisionHeaderProps {
  supervision: ISupervision;
  isCrossingInstructionsIncluded?: boolean;
}

const SupervisionHeader = ({ supervision, isCrossingInstructionsIncluded }: SupervisionHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { routeBridge, startedTime } = supervision || {};
  const { bridge, route } = routeBridge || {};
  const { name = "", identifier = "" } = bridge || {};
  const { permit } = route || {};
  const { permitNumber = "" } = permit || {};

  // TODO - add crossing instructions link
  return (
    <>
      <IonItem className="header itemIcon" detail detailIcon={file} lines="none">
        <IonLabel className="headingText">{t("supervision.transportPermit")}</IonLabel>
        <IonLabel className="iconText">{permitNumber}</IonLabel>
      </IonItem>
      <IonItem className="header" lines="none">
        <IonLabel className="headingText">{t("supervision.supervisionStarted")}</IonLabel>
        <IonLabel>{startedTime ? <Moment format={DATE_TIME_FORMAT_MIN}>{startedTime}</Moment> : ""}</IonLabel>
      </IonItem>
      <IonItem className="header" lines="none">
        <IonLabel className="headingText">{t("supervision.bridgeName")}</IonLabel>
        <IonLabel>
          {name} | {identifier}
        </IonLabel>
      </IonItem>
      {isCrossingInstructionsIncluded && (
        <IonItem className="header itemIcon" detail detailIcon={file} lines="none">
          <IonLabel className="headingText">{t("supervision.crossingInstructions")}</IonLabel>
          <IonLabel className="iconText">TODO</IonLabel>
        </IonItem>
      )}
    </>
  );
};

SupervisionHeader.defaultProps = {
  className: "",
  isCrossingInstructionsIncluded: false,
};

export default SupervisionHeader;
