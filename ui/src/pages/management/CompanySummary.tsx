import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonPage, IonRow, IonText } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import CustomAccordion from "../../components/common/CustomAccordion";
import PermitAccordionHeading from "../../components/management/PermitAccordionHeading";
import PermitAccordionPanel from "../../components/management/PermitAccordionPanel";
import { useTypedSelector } from "../../store/store";
import { getCompany, onRetry } from "../../utils/managementBackendData";

interface CompanySummaryProps {
  companyId: string;
}

const CompanySummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const management = useTypedSelector((state) => state.managementReducer);
  const {
    networkStatus: { isFailed = {} },
  } = management;
  const { companyId = "0" } = useParams<CompanySummaryProps>();

  const { data: selectedCompanyDetail } = useQuery(["getCompany", companyId], () => getCompany(Number(companyId), dispatch), {
    retry: onRetry,
  });

  const { name = "", permits = [] } = selectedCompanyDetail || {};

  const noNetworkNoData = isFailed.getCompany && selectedCompanyDetail === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getCompany} />
      <IonContent fullscreen color="light">
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <IonGrid className="ion-no-padding" fixed>
            <IonRow>
              <IonCol className="ion-padding">
                <IonText className="headingText">{t("management.companySummary.permitListTitle")}</IonText>
              </IonCol>
            </IonRow>

            <IonRow>
              <IonCol className="whiteBackground">
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol>
                      <CustomAccordion
                        items={permits.map((permit, index) => {
                          const key = `permit_${index}`;

                          return {
                            uuid: key,
                            headingColor: "primary",
                            heading: <PermitAccordionHeading permit={permit} />,
                            isPanelOpen: index === 0,
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
