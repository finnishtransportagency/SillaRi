import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import { documentTextOutline } from "ionicons/icons";
import Moment from "react-moment";
import Header from "../components/Header";
import RouteCardList from "../components/RouteCardList";
import { useTypedSelector } from "../store/store";
import { getCompany } from "../utils/backendData";
import { dateFormat } from "../utils/constants";

interface CompanyDetailProps {
  id: string;
}

const CompanyDetail = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { selectedCompanyDetail } = crossings;
  const { name = "", permits = [] } = selectedCompanyDetail || {};
  const { id: companyId = "0" } = useParams<CompanyDetailProps>();

  useEffect(() => {
    getCompany(dispatch, Number(companyId));
  }, [dispatch, companyId]);

  return (
    <IonPage>
      <Header title={name} />
      <IonContent>
        <div className="cardListContainer">
          {permits.map((permit, index) => {
            const key = `permit_${index}`;
            const { id, permitNumber, validStartDate, validEndDate, routes } = permit;
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

                <RouteCardList routes={routes} permitId={id} />
              </div>
            );
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CompanyDetail;
