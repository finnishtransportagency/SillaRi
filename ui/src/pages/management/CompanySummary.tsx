import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonButton, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonPage, IonRow, IonText } from "@ionic/react";
import { add, chevronDown, chevronUp } from "ionicons/icons";
import Moment from "react-moment";
import { Accordion, AccordionItem, AccordionItemButton, AccordionItemHeading, AccordionItemPanel } from "react-accessible-accordion";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getCompany, onRetry } from "../../utils/backendData";
import { dateTimeFormat } from "../../utils/constants";
import "./CompanySummary.css";

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

  useQuery(["getCompany", companyId], () => getCompany(Number(companyId), dispatch, selectedCompanyDetail), { retry: onRetry });

  const noNetworkNoData = isFailed.getCompany && selectedCompanyDetail === undefined;

  let content;
  if (noNetworkNoData) {
    content = <NoNetworkNoData />;
  } else {
    content = (
      <Accordion id="CompanySummaryPermitList" allowMultipleExpanded allowZeroExpanded>
        {permits.map((permit, index) => {
          const key = `permit_${index}`;
          const { id, permitNumber, validStartDate, validEndDate } = permit;
          const addRouteLink = `addTransport/${id}`;
          return (
            <AccordionItem key={key}>
              <AccordionItemHeading>
                <AccordionItemButton>
                  <IonItem lines="none" color="secondary">
                    <IonIcon className="openIcon" icon={chevronDown} slot="end" />
                    <IonIcon className="closeIcon" icon={chevronUp} slot="end" />
                    <IonGrid color="secondary">
                      <IonRow className="ion-align-items-center">
                        <IonCol>
                          <IonText className="headingText">{permitNumber}</IonText>
                        </IonCol>
                        <IonCol>
                          <small>
                            <Moment format={dateTimeFormat}>{validStartDate}</Moment>
                            <IonText>{" - "}</IonText>
                            <Moment format={dateTimeFormat}>{validEndDate}</Moment>
                          </small>
                        </IonCol>
                        <IonCol>
                          <IonButton
                            routerLink={addRouteLink}
                            onClick={(evt) => {
                              evt.stopPropagation();
                            }}
                          >
                            {t("management.companySummary.addTransportButtonLabel")}
                            <IonIcon icon={add} slot="start" />
                          </IonButton>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonItem>
                </AccordionItemButton>
              </AccordionItemHeading>
              <AccordionItemPanel>
                <p>Luvan [{permitNumber}] kuljetusten tiedot tähän...</p>
              </AccordionItemPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    );
  }

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getCompany} />
      <IonContent>
        <IonItem lines="none">
          <h2>{t("management.companySummary.permitListTitle")}</h2>
        </IonItem>
        {content}
      </IonContent>
    </IonPage>
  );
};

export default CompanySummary;
