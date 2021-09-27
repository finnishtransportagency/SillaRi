import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { IonButton, IonCol, IonGrid, IonIcon, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { add } from "ionicons/icons";
import RouteGrid from "./RouteGrid";
import IPermit from "../../interfaces/IPermit";

interface PermitAccordionPanelProps {
  permit: IPermit;
}

const PermitAccordionPanel = ({ permit }: PermitAccordionPanelProps): JSX.Element => {
  const { t } = useTranslation();

  const [transportFilter, setTransportFilter] = useState<string>("");

  const { id: permitId } = permit;

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin">
        <IonCol size="12" size-sm="6" className="ion-padding-bottom ion-text-center">
          <IonButton
            className="ion-hide-md-up"
            color="secondary"
            routerLink={`/management/addTransport/${permitId}`}
            onClick={(evt) => {
              evt.stopPropagation();
            }}
          >
            {t("management.companySummary.addTransportButtonLabel")}
            <IonIcon icon={add} slot="start" />
          </IonButton>
        </IonCol>
        <IonCol size="12" size-sm="6">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="4" size-sm="4" className="ion-padding ion-text-right">
                <IonText>{`${t("management.companySummary.filter.show")}: `}</IonText>
              </IonCol>
              <IonCol size="8" size-sm="8">
                <IonSelect
                  interface="action-sheet"
                  cancelText={t("common.buttons.back")}
                  value={transportFilter}
                  onIonChange={(e) => setTransportFilter(e.detail.value)}
                >
                  <IonSelectOption value="">{t("management.companySummary.filter.status.all")}</IonSelectOption>
                  <IonSelectOption value="planned">{t("management.companySummary.filter.status.planned")}</IonSelectOption>
                  <IonSelectOption value="in_progress">{t("management.companySummary.filter.status.in_progress")}</IonSelectOption>
                  <IonSelectOption value="completed">{t("management.companySummary.filter.status.completed")}</IonSelectOption>
                </IonSelect>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="ion-margin">
        <IonCol>
          <RouteGrid permit={permit} transportFilter={transportFilter} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default PermitAccordionPanel;
