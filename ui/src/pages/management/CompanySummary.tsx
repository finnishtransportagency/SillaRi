import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonSelect, IonSelectOption, IonText } from "@ionic/react";
import { add } from "ionicons/icons";
import Moment from "react-moment";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import CustomAccordion from "../../components/common/CustomAccordion";
import RouteGrid from "../../components/management/RouteGrid";
import { useTypedSelector } from "../../store/store";
import { getCompany, onRetry } from "../../utils/backendData";
import { DATE_FORMAT } from "../../utils/constants";

interface CompanySummaryProps {
  companyId: string;
}

const CompanySummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedCompanyDetail,
    networkStatus: { isFailed = {} },
  } = crossings;
  const { name = "", permits = [] } = selectedCompanyDetail || {};
  const { companyId = "0" } = useParams<CompanySummaryProps>();

  const [transportFilter, setTransportFilter] = useState<string>("");

  useQuery(["getCompany", companyId], () => getCompany(Number(companyId), dispatch, selectedCompanyDetail), { retry: onRetry });

  const addTransportButton = (addRouteLink: string, className?: string) => (
    <IonButton
      className={className}
      color="secondary"
      routerLink={addRouteLink}
      onClick={(evt) => {
        evt.stopPropagation();
      }}
    >
      {t("management.companySummary.addTransportButtonLabel")}
      <IonIcon icon={add} slot="start" />
    </IonButton>
  );

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
                          const { id, permitNumber, validStartDate, validEndDate, routes = [] } = permit;
                          const addRouteLink = `/management/addTransport/${id}`;

                          return {
                            uuid: key,
                            headingColor: "primary",
                            heading: (
                              <IonGrid className="ion-no-padding">
                                <IonRow className="ion-margin ion-align-items-center">
                                  <IonCol>
                                    <IonGrid className="ion-no-padding">
                                      <IonRow>
                                        <IonCol>
                                          <IonText className="headingText">{permitNumber}</IonText>
                                        </IonCol>
                                      </IonRow>
                                      <IonRow>
                                        <IonCol>
                                          <small>
                                            <Moment format={DATE_FORMAT}>{validStartDate}</Moment>
                                            <IonText>{" - "}</IonText>
                                            <Moment format={DATE_FORMAT}>{validEndDate}</Moment>
                                          </small>
                                        </IonCol>
                                      </IonRow>
                                    </IonGrid>
                                  </IonCol>
                                  <IonCol>
                                    <IonText>{`${t("management.companySummary.transports")}: ${routes.length}`}</IonText>
                                  </IonCol>
                                  <IonCol className="ion-hide-md-down">{addTransportButton(addRouteLink)}</IonCol>
                                </IonRow>
                              </IonGrid>
                            ),
                            isPanelOpen: index === 0,
                            panel: (
                              <IonGrid className="ion-no-padding">
                                <IonRow className="ion-margin">
                                  <IonCol size="12" size-sm="6" className="ion-padding-bottom ion-text-center">
                                    {addTransportButton(addRouteLink, "ion-hide-md-up")}
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
                                            <IonSelectOption value="in_progress">
                                              {t("management.companySummary.filter.status.in_progress")}
                                            </IonSelectOption>
                                            <IonSelectOption value="completed">
                                              {t("management.companySummary.filter.status.completed")}
                                            </IonSelectOption>
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
                            ),
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
