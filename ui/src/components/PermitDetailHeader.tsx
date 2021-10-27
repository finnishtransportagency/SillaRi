import React from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import file from "../theme/icons/file.svg";

interface PermitDetailHeaderProps {
  permit: IPermit;
}

const PermitDetailHeader = ({ permit }: PermitDetailHeaderProps): JSX.Element => {
  const { t } = useTranslation();
  const { permitNumber } = permit || {};

  return (
    <IonItem className="header itemIcon" detail detailIcon={file} lines="none">
      <IonLabel className="headingText">{t("route.transportPermit")}</IonLabel>
      <IonLabel>{permitNumber}</IonLabel>
    </IonItem>
  );
};

export default PermitDetailHeader;
