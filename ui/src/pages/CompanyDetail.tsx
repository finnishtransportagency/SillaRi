import React from "react";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import RouteCardListHeader from "../components/RouteCardListHeader";
import RouteCardList from "../components/RouteCardList";
import { useTypedSelector } from "../store/store";
import { getCompany, onRetry } from "../utils/supervisionBackendData";

interface CompanyDetailProps {
  id: string;
}

const CompanyDetail = (): JSX.Element => {
  const dispatch = useDispatch();

  const { id: companyId = "0" } = useParams<CompanyDetailProps>();
  const {
    selectedCompanyDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);
  const { name = "", permits = [] } = selectedCompanyDetail || {};

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
            const { routes = [] } = permit;
            return (
              <div key={key}>
                <RouteCardListHeader permit={permit} />
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
