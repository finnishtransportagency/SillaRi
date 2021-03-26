import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { RouteComponentProps } from "react-router";
import { IonCol, IonContent, IonGrid, IonIcon, IonPage, IonRow, IonText } from "@ionic/react";
import { documentTextOutline } from "ionicons/icons";
import { useQuery } from "@apollo/client";
import Moment from "react-moment";
import Header from "../components/Header";
import RouteCardList from "../components/RouteCardList";
import { companyQuery } from "../graphql/CompanyQuery";
import ICompanyDetail from "../interfaces/ICompanyDetail";
import { actions as crossingActions } from "../store/crossingsSlice";
import { useTypedSelector } from "../store/store";
import { dateFormat } from "../utils/constants";

interface CompanyDetailProps {
  id: string;
}

const CompanyDetail = ({ match }: RouteComponentProps<CompanyDetailProps>): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const { selectedCompanyDetail } = crossings;
  const { name = "", authorizations = [] } = selectedCompanyDetail || {};

  const {
    params: { id: companyId },
  } = match;

  useQuery<ICompanyDetail>(companyQuery(Number(companyId)), {
    onCompleted: (response) => dispatch({ type: crossingActions.GET_COMPANY, payload: response }),
    onError: (err) => console.error(err),
  });

  return (
    <IonPage>
      <Header title={name} />
      <IonContent>
        <div className="cardListContainer">
          {authorizations.map((permit, index) => {
            const key = `permit_${index}`;
            const { permissionId, validStartDate, validEndDate, routes } = permit;
            return (
              <div key={key}>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonGrid>
                        <IonRow>
                          <IonCol>
                            <IonText>{`${t("company.transportPermit")} ${permissionId}`}</IonText>
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
          })}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CompanyDetail;
