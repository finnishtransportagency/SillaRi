import React, { MouseEvent, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonButtons, IonCol, IonContent, IonFab, IonGrid, IonHeader, IonIcon, IonModal, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import { Document, Page } from "react-pdf";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import close from "../theme/icons/close_large_white.svg";
import { getOrigin } from "../utils/request";

interface PermitPdfPreviewProps {
  id: number;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

// IMPORTANT NOTE:
// This uses react-pdf (https://github.com/wojtekmaj/react-pdf) which uses PDF.js from Mozilla (https://github.com/mozilla/pdfjs-dist)
// The version of pdfjs-dist must match the version used in react-pdf otherwise errors occur
// If the react-pdf dependency is updated, do the following:
//   1. Manually update the pdfjs-dist version in package.json to the version used in react-pdf (currently 2.12.313)
//   2. Copy pdf.worker.js from ./node_modules/pdfjs-dist/build to ./public
const PermitPdfPreview = ({ id, isOpen, setOpen }: PermitPdfPreviewProps): JSX.Element => {
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
    <IonModal isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle class="headingText">{t("permitPdf.title")}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(evt) => closePreview(evt as MouseEvent)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} scrollX={false} scrollY={false} onClick={(evt) => evt.stopPropagation()}>
        <Document
          file={`${getOrigin()}/api/permit/getpermitpdf?id=${id}`}
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
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
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
        </IonFab>
      </IonContent>
    </IonModal>
  );
};

export default PermitPdfPreview;
