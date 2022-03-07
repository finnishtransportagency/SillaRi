import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import CustomSelect from "../common/CustomSelect";
import RouteGrid from "./RouteGrid";
import IPermit from "../../interfaces/IPermit";
import { actions } from "../../store/rootSlice";
import { isPermitValid } from "../../utils/validation";

interface PermitAccordionPanelProps {
  permit: IPermit;
}

const PermitAccordionPanel = ({ permit }: PermitAccordionPanelProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [transportFilter, setTransportFilter] = useState<string>("");

  const { id: permitId } = permit;

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin">
        <IonCol size="12" size-sm="6" className="ion-padding-bottom ion-text-center">
          {isPermitValid(permit) && (
            <IonButton
              className="ion-hide-md-up"
              color="secondary"
              expand="block"
              size="large"
              routerLink={`/management/addTransport/${permitId}`}
              onClick={(evt) => {
                dispatch({ type: actions.SET_MANAGEMENT_PERMIT_ID, payload: permitId });
                evt.stopPropagation();
              }}
            >
              {t("management.companySummary.addTransportButtonLabel")}
            </IonButton>
          )}
        </IonCol>
        <IonCol size="12" size-sm="6">
          <IonGrid className="ion-no-padding">
            <IonRow>
              <IonCol size="4" size-sm="4" className="ion-padding ion-text-right">
                <IonText>{`${t("management.companySummary.filter.show")}: `}</IonText>
              </IonCol>
              <IonCol size="8" size-sm="8">
                <CustomSelect
                  options={[
                    { value: "", label: t("management.companySummary.filter.status.all") },
                    { value: "planned", label: t("management.companySummary.filter.status.planned") },
                    { value: "in_progress", label: t("management.companySummary.filter.status.in_progress") },
                    { value: "completed", label: t("management.companySummary.filter.status.completed") },
                  ]}
                  selectedValue={transportFilter}
                  onChange={(status) => setTransportFilter(status as string)}
                />
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
