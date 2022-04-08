import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonCol, IonContent, IonGrid, IonItem, IonPage, IonRow, IonText } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import CustomAccordion from "../../components/common/CustomAccordion";
import PermitAccordionHeading from "../../components/management/PermitAccordionHeading";
import PermitAccordionPanel from "../../components/management/PermitAccordionPanel";
import { useTypedSelector } from "../../store/store";
import { onRetry } from "../../utils/backendData";
import { getCompany } from "../../utils/managementBackendData";
import Loading from "../../components/Loading";

const CompanySummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.rootReducer);
  const {
    networkStatus: { isFailed = {} },
    selectedManagementPermitId,
  } = management;

  const { isLoading: loadingData, data: selectedCompanyDetail } = useQuery(["getCompany"], () => getCompany(dispatch), {
    retry: onRetry,
  });

  const { name = "", permits = [] } = selectedCompanyDetail || {};

  const noNetworkNoData = isFailed.getCompany && selectedCompanyDetail === undefined;

  const [elementRefs] = useState<{ [permitId: number]: HTMLIonGridElement }>({});

  const setRef = (permitId: number, element: HTMLIonGridElement) => {
    // Store a ref to the accordion heading for this permit
    elementRefs[permitId] = element;
  };

  useEffect(() => {
    if (selectedManagementPermitId && elementRefs[selectedManagementPermitId]) {
      // Scroll to the previously opened permit
      elementRefs[selectedManagementPermitId].scrollIntoView();
    }
  }, [selectedManagementPermitId, elementRefs]);

  return (
    <IonPage>
      <Header
        title={t("main.header.title")}
        secondaryTitle={name}
        titleStyle="headingBoldText ion-text-center"
        somethingFailed={isFailed.getCompany}
      />
      <IonContent color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : loadingData ? (
          <Loading />
        ) : name === "" || permits.length < 1 ? (
          <IonItem lines="none" color="warning">
            {t("management.companySummary.noPermitsWarning")}
          </IonItem>
        ) : (
          <IonGrid className="ion-no-padding" fixed>
            <IonRow>
              <IonCol className="ion-padding">
                <IonText className="headingBoldText">{t("management.companySummary.permitListTitle")}</IonText>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="whiteBackground">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol>
                      <CustomAccordion
                        items={permits
                          .sort((a, b) => a.permitNumber.localeCompare(b.permitNumber))
                          .map((permit, index) => {
                            const { id: permitId } = permit;
                            const key = `permit_${index}`;

                            return {
                              uuid: key,
                              // headingColor: "primary",
                              heading: <PermitAccordionHeading ref={(el: HTMLIonGridElement) => setRef(permitId, el)} permit={permit} />,
                              isPanelOpen: selectedManagementPermitId ? selectedManagementPermitId === permitId : index === 0,
                              panel: <PermitAccordionPanel permit={permit} />,
                            };
                          })}
                      />
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default CompanySummary;
