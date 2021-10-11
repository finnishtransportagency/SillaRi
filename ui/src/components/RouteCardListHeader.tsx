import React from "react";
import { useTranslation } from "react-i18next";
import Moment from "react-moment";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import { document } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";
import { DATE_FORMAT } from "../utils/constants";
import "./RouteCardListHeader.css";

interface RouteCardListHeaderProps {
  permit: IPermit;
}

const RouteCardListHeader = ({ permit }: RouteCardListHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const { permitNumber, validStartDate, validEndDate } = permit;

  return (
    <IonItem className="routeListHeader" detail detailIcon={document} lines="none">
      <IonLabel>
        <IonLabel className="headingText">{permitNumber}</IonLabel>
        <IonLabel>
          <small>
            <IonText>{`${t("company.validityPeriod")} `}</IonText>
            <Moment format={DATE_FORMAT}>{validStartDate}</Moment>
            <IonText>{" - "}</IonText>
            <Moment format={DATE_FORMAT}>{validEndDate}</Moment>
          </small>
        </IonLabel>
      </IonLabel>
    </IonItem>
  );
};

export default RouteCardListHeader;
