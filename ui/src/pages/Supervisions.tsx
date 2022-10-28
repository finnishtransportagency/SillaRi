import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { onlineManager, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import type { SegmentChangeEventDetail } from "@ionic/core";
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton } from "@ionic/react";
import Header from "../components/Header";
import { useTypedSelector, RootState } from "../store/store";
import { getUserData, onRetry } from "../utils/backendData";
import { getCompanyTransportsList, getSupervisionList } from "../utils/supervisionBackendData";
import SupervisionList from "../components/SupervisionList";
import "./Supervisions.css";
import CompanyTransportsAccordion from "../components/CompanyTransportsAccordion";
import ISupervisionDay from "../interfaces/ISupervisionDay";
import { groupSupervisionsByPlannedDate, sortSupervisionsByTimeAndBridgeOrder } from "../utils/supervisionUtil";
import { useHistory, useParams } from "react-router-dom";
import OwnList from "../components/supervisionOwnList/OwnList";

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
  const [isOnline, setOnline] = useState<boolean>(onlineManager.isOnline());

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state: RootState) => state.rootReducer);

  const { data: supervisorUser } = useQuery(["getSupervisor"], () => getUserData(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });
  const { username = "" } = supervisorUser || {};

  const { data: companyTransportsList = [] } = useQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  const { data: supervisionList = [] } = useQuery(["getSupervisionList"], () => getSupervisionList(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
  });

  useEffect(() => {
    onlineManager.subscribe(() => {
      setOnline(onlineManager.isOnline());
    });
  }, []);

  useEffect(() => {
    // Group the supervisions with useEffect instead of useQuery, since onSuccess is not called when using cached data
    if (supervisionList && supervisionList.length > 0) {
      const groupedSupervisions = groupSupervisionsByPlannedDate(supervisionList);
      groupedSupervisions.forEach((s) => sortSupervisionsByTimeAndBridgeOrder(s.supervisions));
      setSupervisionDays(groupedSupervisions);
    }
  }, [supervisionList]);

  const changeSegment = (evt: CustomEvent<SegmentChangeEventDetail>) => {
    const newValue = evt.detail.value;
    if (newValue !== undefined) {
      setCurrentSegment(newValue);
      history.replace(`/supervisions/${newValue}`);
    }
  };

  const ownListCount = "?";
  const transportsCount = companyTransportsList.map((ct) => (ct.transports ? ct.transports.length : 0)).reduce((prev, next) => prev + next, 0);
  const bridgesCount = supervisionDays.map((sd) => (sd.supervisions ? sd.supervisions.length : 0)).reduce((prev, next) => prev + next, 0);

  const noNetworkNoData =
    (isFailed.getCompanyTransportsList && companyTransportsList.length === 0) || (isFailed.getSupervisionList && supervisionList.length === 0);

  return (
    <IonPage>
      <Header
        title={t("main.header.title")}
        titleStyle="headingBoldText ion-text-center"
        somethingFailed={isFailed.getCompanyTransportsList || isFailed.getSupervisionList}
        includeSendingList
        includeOfflineBanner
        // includeUnsentOfflineCheck={onlineManager.isOnline()}
      />
      <IonSegment className="mainSegment" value={currentSegment} onIonChange={changeSegment}>
        <IonSegmentButton className="mainSegmentButton" value="2">
          <IonLabel>{`${t("main.tab.ownList")} (${ownListCount})`}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton className="mainSegmentButton" value="0">
          <IonLabel>{`${t("main.tab.transports")} (${transportsCount})`}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton className="mainSegmentButton" value="1">
          <IonLabel>{`${t("main.tab.bridges")} (${bridgesCount})`}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonContent color="light">
        {currentSegment === "0" && (
          <CompanyTransportsAccordion
            username={username}
            companyTransportsList={companyTransportsList}
            noNetworkNoData={noNetworkNoData}
            isOnline={isOnline}
          />
        )}
        {currentSegment === "1" && (
          <SupervisionList username={username} supervisionDays={supervisionDays} noNetworkNoData={noNetworkNoData} isOnline={isOnline} />
        )}
        {currentSegment === "2" && <OwnList username={username} noNetworkNoData={noNetworkNoData} isOnline={isOnline} />}
      </IonContent>
    </IonPage>
  );
};

export default Supervisions;
