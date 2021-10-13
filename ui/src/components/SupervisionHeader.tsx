import React from "react";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { IonItem, IonLabel } from "@ionic/react";
import { document } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import { DATE_TIME_FORMAT_MIN } from "../utils/constants";
import "./SupervisionHeader.css";

interface SupervisionHeaderProps {
  permit: IPermit;
  routeBridge: IRouteBridge;
  supervision: ISupervision;
  className?: string;
  isCrossingInstructionsIncluded?: boolean;
}

const SupervisionHeader = ({ permit, routeBridge, supervision, className, isCrossingInstructionsIncluded }: SupervisionHeaderProps): JSX.Element => {
  const { t } = useTranslation();

  const { permitNumber = "" } = permit || {};
  const { bridge } = routeBridge || {};
  const { startedTime } = supervision || {};
  const { name = "", identifier = "" } = bridge || {};

  // TODO - add crossing instructions link
  return (
    <>
      <IonItem className={className} detailIcon={document} lines="none">
        <IonLabel className="headingText">{t("supervision.permitNumber")}</IonLabel>
        <IonLabel>{permitNumber}</IonLabel>
      </IonItem>
      <IonItem className={className} lines="none">
        <IonLabel>{t("supervision.supervisionStarted")}</IonLabel>
        <IonLabel>{startedTime ? <Moment format={DATE_TIME_FORMAT_MIN}>{startedTime}</Moment> : ""}</IonLabel>
      </IonItem>
      <IonItem className={className} lines="none">
        <IonLabel>{t("supervision.bridgeName")}</IonLabel>
        <IonLabel>
          {name} | {identifier}
        </IonLabel>
      </IonItem>
      {isCrossingInstructionsIncluded && (
        <IonItem className={`${className} itemIcon`} detail detailIcon={document} lines="none">
          <IonLabel>{t("supervision.crossingInstructions")}</IonLabel>
          <IonLabel className="crossingInstructionsLink">TODO</IonLabel>
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
