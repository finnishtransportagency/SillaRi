import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import { documentTextOutline } from "ionicons/icons";
import Moment from "react-moment";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteCardList from "../components/RouteCardList";
import { useTypedSelector } from "../store/store";
import { getCompany, onRetry } from "../utils/backendData";
import { dateFormat } from "../utils/constants";

interface CompanyDetailProps {
  id: string;
}

const CompanyDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedCompanyDetail,
    networkStatus: { isFailed = {} },
  } = crossings;
  const { name = "", permits = [] } = selectedCompanyDetail || {};
  const { id: companyId = "0" } = useParams<CompanyDetailProps>();

  useQuery(["getCompany", companyId], () => getCompany(Number(companyId), dispatch, selectedCompanyDetail), { retry: onRetry });

  const noNetworkNoData = isFailed.getCompany && selectedCompanyDetail === undefined;

  return (
    <IonPage>
      <Header title={name} somethingFailed={isFailed.getCompany} />
      <IonContent>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          permits.map((permit, index) => {
            const key = `permit_${index}`;
            const { permitNumber, validStartDate, validEndDate, routes } = permit;
            return (
              <div key={key}>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonGrid className="ion-no-padding">
                        <IonRow>
                          <IonCol>
                            <IonText className="headingText">{`${t("company.transportPermit")} ${permitNumber}`}</IonText>
                          </IonCol>
                        </IonRow>
                        <IonRow>
                          <IonCol>
                            <small>
                              <IonText>{`${t("company.validityPeriod")} `}</IonText>
                              <Moment format={dateFormat}>{validStartDate}</Moment>
                              <IonText>{" - "}</IonText>
                              <Moment format={dateFormat}>{validEndDate}</Moment>
                            </small>
                          </IonCol>
                        </IonRow>
                      </IonGrid>
                    </IonCol>
                    <IonCol size="auto">
                      <IonIcon icon={documentTextOutline} />
                      <IonText>{" PDF"}</IonText>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <RouteCardList routes={routes} />
              </div>
            );
          })
        )}
      </IonContent>
    </IonPage>
  );
};

export default CompanyDetail;
