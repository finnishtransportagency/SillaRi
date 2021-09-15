import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonItem, IonPage } from "@ionic/react";
import Header from "../../components/Header";
import NoNetworkNoData from "../../components/NoNetworkNoData";
import { useTypedSelector } from "../../store/store";
import { getPermit, onRetry } from "../../utils/backendData";
import "./CompanySummary.css";

interface AddTransportProps {
  permitId: string;
}

const AddTransport = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const crossings = useTypedSelector((state) => state.crossingsReducer);
  const {
    selectedPermitDetail,
    networkStatus: { isFailed = {} },
  } = crossings;
  const { permitNumber } = selectedPermitDetail || {};
  const { permitId = "0" } = useParams<AddTransportProps>();

  useQuery(["getPermit", permitId], () => getPermit(Number(permitId), dispatch, selectedPermitDetail), { retry: onRetry });

  const noNetworkNoData = isFailed.getCompany && selectedPermitDetail === undefined;

  let content;
  if (noNetworkNoData) {
    content = <NoNetworkNoData />;
  } else {
    content = (
      <div>
        <p>Tästä lisätään kuljetus kuljetusluvalle [{permitNumber}]...</p>
      </div>
    );
  }

  return (
    <IonPage>
      <Header title={t("management.addTransport.headerTitle")} somethingFailed={isFailed.getPermit} />
      <IonContent>
        <IonItem lines="none">{content}</IonItem>
      </IonContent>
    </IonPage>
  );
};

export default AddTransport;
