import React, { MouseEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonLabel, IonModal, IonRow } from "@ionic/react";
import { Document, Page } from "react-pdf";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import close from "../theme/icons/close_large_white.svg";
import { getOrigin } from "../utils/request";

interface PermitPdfPreviewProps {
  pdfObjectKey: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

// IMPORTANT NOTE:
// This uses react-pdf (https://github.com/wojtekmaj/react-pdf) which uses PDF.js from Mozilla (https://github.com/mozilla/pdfjs-dist)
// The version of pdfjs-dist must match the version used in react-pdf otherwise errors occur
// If the react-pdf dependency is updated, do the following:
//   1. Manually update the pdfjs-dist version in package.json to the version used in react-pdf (currently 2.10.377)
//   2. Copy pdf.worker.js from ./node_modules/pdfjs-dist/build to ./public
const PermitPdfPreview = ({ pdfObjectKey, isOpen, setOpen }: PermitPdfPreviewProps): JSX.Element => {
  const contentRef = useRef<HTMLIonContentElement>(null);
  const { t } = useTranslation();

  const [totalPages, setTotalPages] = useState<number>(0);
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  // Store references to the pinch-zoom transform wrapper props for use by the buttons
  let transformZoomIn: () => void;
  let transformZoomOut: () => void;

  const closePreview = (evt: MouseEvent) => {
    evt.stopPropagation();
    setOpen(false);
  };

  return (
    <IonModal cssClass="" isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonItem color="primary" onClick={(evt) => evt.stopPropagation()}>
        <IonLabel className="headingBoldText">{t("permitPdf.title")}</IonLabel>
        <IonIcon className="otherIconLarge" slot="end" icon={close} onClick={(evt) => closePreview(evt as MouseEvent)} />
      </IonItem>

      <IonContent ref={contentRef} scrollX={false} scrollY={false} onClick={(evt) => evt.stopPropagation()}>
        <Document
          file={`${getOrigin()}/api/permit/getpermitpdf?objectKey=${pdfObjectKey}`}
          renderMode="svg"
          onLoadSuccess={onDocumentLoadSuccess}
          loading={t("permitPdf.loading")}
          error={t("permitPdf.error")}
          noData={t("permitPdf.noData")}
        >
          <TransformWrapper limitToBounds={false}>
            {({ zoomIn, zoomOut }) => {
              transformZoomIn = zoomIn;
              transformZoomOut = zoomOut;

              return (
                <TransformComponent>
                  {Array.from(new Array(totalPages), (el, index) => (
                    <Page key={`page_${index + 1}`} pageNumber={index + 1} width={contentRef.current?.clientWidth} scale={1} />
                  ))}
                </TransformComponent>
              );
            }}
          </TransformWrapper>
        </Document>
      </IonContent>

      <IonItem lines="none" onClick={(evt) => evt.stopPropagation()}>
        <IonGrid className="ion-no-padding">
          <IonRow>
            <IonCol className="ion-text-center">
              <IonButton className="ion-margin" color="primary" size="default" onClick={() => transformZoomIn()}>
                {t("permitPdf.zoomIn")}
              </IonButton>
            </IonCol>
            <IonCol className="ion-text-center">
              <IonButton className="ion-margin" color="primary" size="default" onClick={() => transformZoomOut()}>
                {t("permitPdf.zoomOut")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>
    </IonModal>
  );
};

export default PermitPdfPreview;
