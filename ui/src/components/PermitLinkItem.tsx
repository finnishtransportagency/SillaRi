import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IonItem, IonLabel, IonText } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import file from "../theme/icons/file.svg";
import PermitPdfPreview from "./PermitPdfPreview";

interface PermitLinkItemProps {
  permit: IPermit;
  isHeader?: boolean;
}

const PermitLinkItem = ({ permit, isHeader }: PermitLinkItemProps): JSX.Element => {
  const { t } = useTranslation();
  const [isPermitPdfOpen, setPermitPdfOpen] = useState<boolean>(false);
  const { permitNumber, pdfObjectKey = "" } = permit || {};

  return pdfObjectKey.length > 0 ? (
    <>
      <IonItem className={`${isHeader ? "header" : ""} itemIcon`} detail detailIcon={file} lines="none" onClick={() => setPermitPdfOpen(true)}>
        <IonLabel className="headingText">{t("permitPdf.title")}</IonLabel>
        <IonLabel>
          <IonText className="linkText">{permitNumber}</IonText>
        </IonLabel>
      </IonItem>

      {isPermitPdfOpen && <PermitPdfPreview pdfObjectKey={pdfObjectKey} isOpen={isPermitPdfOpen} setOpen={setPermitPdfOpen} />}
    </>
  ) : (
    <IonItem className={isHeader ? "header" : ""} detail detailIcon="" lines="none">
      <IonLabel className="headingText">{t("permitPdf.title")}</IonLabel>
      <IonLabel>{permitNumber}</IonLabel>
    </IonItem>
  );
};

PermitLinkItem.defaultProps = {
  isHeader: false,
};

export default PermitLinkItem;