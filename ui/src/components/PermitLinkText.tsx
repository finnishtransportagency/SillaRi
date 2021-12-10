import React, { useState } from "react";
import { IonText } from "@ionic/react";
import IPermit from "../interfaces/IPermit";
import PermitPdfPreview from "./PermitPdfPreview";

interface PermitLinkTextProps {
  permit: IPermit;
}

const PermitLinkText = ({ permit }: PermitLinkTextProps): JSX.Element => {
  const [isPermitPdfOpen, setPermitPdfOpen] = useState<boolean>(false);
  const { permitNumber, pdfObjectKey = "" } = permit || {};

  return pdfObjectKey && pdfObjectKey.length > 0 ? (
    <>
      <IonText className="linkText" onClick={() => setPermitPdfOpen(true)}>
        {permitNumber}
      </IonText>

      {isPermitPdfOpen && <PermitPdfPreview pdfObjectKey={pdfObjectKey} isOpen={isPermitPdfOpen} setOpen={setPermitPdfOpen} />}
    </>
  ) : (
    <IonText>{permitNumber}</IonText>
  );
};

export default PermitLinkText;
