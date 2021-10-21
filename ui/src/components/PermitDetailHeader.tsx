import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import { document } from "ionicons/icons";
import IPermit from "../interfaces/IPermit";

interface PermitDetailHeaderProps {
  permit: IPermit;
}

const PermitDetailHeader = ({ permit }: PermitDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const { permitNumber } = permit || {};

  return (
    <IonItem className="header itemIcon" detail detailIcon={document} lines="none">
      <IonLabel className="headingText">{t("route.transportPermit")}</IonLabel>
      <IonLabel>{permitNumber}</IonLabel>
    </IonItem>
  );
};

export default PermitDetailHeader;
