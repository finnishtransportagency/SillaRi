import React, { MouseEvent, useState } from "react";
import { IonText } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import PermitPdfPreview from "./PermitPdfPreview";

interface PermitLinkTextProps {
  permit: IPermit;
  className?: string;
}

const PermitLinkText = ({ permit, className }: PermitLinkTextProps): JSX.Element => {
  const [isPermitPdfOpen, setPermitPdfOpen] = useState<boolean>(false);
  const { id, permitNumber, pdfObjectKey = "" } = permit || {};

  const openPreview = (evt: MouseEvent) => {
    evt.stopPropagation();
    setPermitPdfOpen(true);
  };

  return pdfObjectKey && pdfObjectKey.length > 0 ? (
    <>
      <IonText className={`linkText ${className || ""}`} onClick={(evt) => openPreview(evt)}>
        {permitNumber}
      </IonText>

      <PermitPdfPreview id={id} isOpen={isPermitPdfOpen} setOpen={setPermitPdfOpen} />
    </>
  ) : (
    <IonText>{permitNumber}</IonText>
  );
};

PermitLinkText.defaultProps = {
  className: undefined,
};

export default PermitLinkText;
