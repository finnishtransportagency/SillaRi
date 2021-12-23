import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import type { SegmentChangeEventDetail } from "@ionic/core";
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton } from "@ionic/react";
import Header from "../components/Header";
import { useTypedSelector } from "../store/store";
import { onRetry } from "../utils/backendData";
import { getCompanyTransportsList, getSupervisionList } from "../utils/supervisionBackendData";
import SupervisionList from "../components/SupervisionList";
import "./Supervisions.css";
import CompanyTransportsAccordion from "../components/CompanyTransportsAccordion";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { groupSupervisionsByDate, sortSupervisionsByTimeAndBridgeOrder } from "../utils/supervisionUtil";
import { useHistory, useParams } from "react-router-dom";

interface SupervisionsProps {
  tabId: string;
}

const Supervisions = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();

  const { tabId = "0" } = useParams<SupervisionsProps>();

  const [currentSegment, setCurrentSegment] = useState<string>(tabId);
  const [supervisionDays, setSupervisionDays] = useState<ISupervisionDay[]>([]);

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.rootReducer);

  const { data: companyTransportsList = [] } = useQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
    retry: onRetry,
  });

  const { data: supervisionList = [] } = useQuery(["getSupervisionList"], () => getSupervisionList(dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      if (data && data.length > 0) {
        const groupedSupervisions = groupSupervisionsByDate(data);
        groupedSupervisions.forEach((s) => sortSupervisionsByTimeAndBridgeOrder(s.supervisions));
        setSupervisionDays(groupedSupervisions);
      }
    },
  });

  const changeSegment = (evt: CustomEvent<SegmentChangeEventDetail>) => {
    const newValue = evt.detail.value;
    if (newValue !== undefined) {
      setCurrentSegment(newValue);
      history.replace(`/supervisions/${newValue}`);
    }
  };

  const transportsCount = companyTransportsList.map((ct) => (ct.transports ? ct.transports.length : 0)).reduce((prev, next) => prev + next, 0);
  const bridgesCount = supervisionDays.map((sd) => (sd.supervisions ? sd.supervisions.length : 0)).reduce((prev, next) => prev + next, 0);

  const noNetworkNoData =
    (isFailed.getCompanyTransportsList && companyTransportsList.length === 0) || (isFailed.getSupervisionList && supervisionList.length === 0);

  return (
    <IonPage>
      <Header title={t("main.header.title")} somethingFailed={isFailed.getCompanyTransportsList || isFailed.getSupervisionList} includeSendingList />
      <IonSegment className="mainSegment" value={currentSegment} onIonChange={changeSegment}>
        <IonSegmentButton className="mainSegmentButton" value="0">
          <IonLabel>{`${t("main.tab.transports")} (${transportsCount})`}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton className="mainSegmentButton" value="1">
          <IonLabel>{`${t("main.tab.bridges")} (${bridgesCount})`}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonContent>
        {currentSegment === "0" && <CompanyTransportsAccordion companyTransportsList={companyTransportsList} noNetworkNoData={noNetworkNoData} />}
        {currentSegment === "1" && <SupervisionList supervisionDays={supervisionDays} noNetworkNoData={noNetworkNoData} />}
      </IonContent>
    </IonPage>
  );
};

export default Supervisions;
