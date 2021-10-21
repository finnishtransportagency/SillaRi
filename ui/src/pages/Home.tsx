import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import type { SegmentChangeEventDetail } from "@ionic/core";
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSlide, IonSlides } from "@ionic/react";
import Header from "../components/Header";
import { useTypedSelector } from "../store/store";
import { getCompanyTransportsList, getSupervisionList, onRetry } from "../utils/supervisionBackendData";
import SupervisionList from "../components/SupervisionList";
import "./Home.css";
import CompanyTransportsAccordion from "../components/CompanyTransportsAccordion";

const Home = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [currentSegment, setCurrentSegment] = useState<string>("0");
  const slidesRef = useRef<HTMLIonSlidesElement>(null);

  const {
    companyTransportsList = [],
    supervisionList = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const transportsCountList = companyTransportsList.map((ct) => (ct.transports ? ct.transports.length : 0));
  const transportsCount = transportsCountList.length > 1 ? transportsCountList.reduce((prev, next) => prev + next) : transportsCountList[0];

  // TODO use logged in user
  const supervisorUser = "USER1";

  useQuery(["getCompanyTransportsList"], () => getCompanyTransportsList(supervisorUser, dispatch), { retry: onRetry });
  useQuery(["getSupervisionList"], () => getSupervisionList(supervisorUser, dispatch), { retry: onRetry });

  const changeSlide = (evt: CustomEvent<SegmentChangeEventDetail>) => {
    if (slidesRef.current) {
      slidesRef.current.slideTo(Number(evt.detail.value));
    }
  };

  const changeSegment = async () => {
    if (slidesRef.current) {
      const newSlideIndex = await slidesRef.current.getActiveIndex();
      setCurrentSegment(String(newSlideIndex));
    }
  };

  const noNetworkNoData =
    (isFailed.getCompanyTransportsList && companyTransportsList.length === 0) || (isFailed.getSupervisionList && supervisionList.length === 0);

  return (
    <IonPage>
      <Header title={t("main.header.title")} somethingFailed={isFailed.getCompanyTransportsList || isFailed.getSupervisionList} />
      <IonSegment className="mainSegment" value={currentSegment} onIonChange={changeSlide}>
        <IonSegmentButton className="mainSegmentButton" value="0">
          <IonLabel>{`${t("main.tab.transports")} (${transportsCount})`}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton className="mainSegmentButton" value="1">
          <IonLabel>{`${t("main.tab.bridges")} (${supervisionList.length})`}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonContent>
        <IonSlides ref={slidesRef} onIonSlideDidChange={changeSegment}>
          <IonSlide>
            <CompanyTransportsAccordion companyTransportsList={companyTransportsList} noNetworkNoData={noNetworkNoData} />
          </IonSlide>
          <IonSlide>
            <SupervisionList supervisionList={supervisionList} noNetworkNoData={noNetworkNoData} />
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Home;
