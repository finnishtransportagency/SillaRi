import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { IonButton, IonCol, IonGrid, IonRow, IonText } from "@ionic/react";
import CustomSelect from "../common/CustomSelect";
import RouteGrid from "./RouteGrid";
import IPermit from "../../interfaces/IPermit";
import { actions } from "../../store/rootSlice";
import { isPermitValid } from "../../utils/validation";
import TransportCountModal from "./TransportCountModal";
import { useQuery } from "react-query";
import { getRouteTransportsOfPermit } from "../../utils/managementBackendData";
import { onRetry } from "../../utils/backendData";
import IRouteTransport from "../../interfaces/IRouteTransport";

interface PermitAccordionPanelProps {
  permit: IPermit;
}

const PermitAccordionPanel = ({ permit }: PermitAccordionPanelProps): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [transportFilter, setTransportFilter] = useState<string>("");
  const [transportCountModalOpen, setTransportCountModalOpen] = useState<boolean>(false);

  const { id: permitId, permitNumber, isCurrentVersion } = permit;

  const { data: routeTransportList } = useQuery(
    ["getRouteTransportsOfPermit", Number(permitId)],
    () => getRouteTransportsOfPermit(Number(permitId), permitNumber, dispatch),
    {
      retry: onRetry,
    }
  );

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-margin ion-hide-md-up">
        <IonCol size="12" className="ion-padding-bottom ion-text-center">
          {isPermitValid(permit) && isCurrentVersion && (
            <IonButton
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
      </IonRow>
      <IonRow className="ion-margin ion-align-items-center ion-justify-content-between">
        <IonCol size="6">
          <IonText>{`${t("management.companySummary.transportCount")}: `}</IonText>
          <IonText className="linkText" onClick={() => setTransportCountModalOpen(true)}>
            {t("management.companySummary.showByRoute")}
          </IonText>
        </IonCol>
        <IonCol size="6">
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
                  usePortal={true}
                />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>

      <IonRow className="ion-margin">
        <IonCol>
          <RouteGrid permit={permit} routeTransports={routeTransportList as IRouteTransport[]} transportFilter={transportFilter} />
        </IonCol>
      </IonRow>
      <TransportCountModal
        isOpen={transportCountModalOpen}
        setOpen={setTransportCountModalOpen}
        permit={permit}
        routeTransports={routeTransportList as IRouteTransport[]}
      />
    </IonGrid>
  );
};

export default PermitAccordionPanel;
