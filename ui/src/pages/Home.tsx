import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import type { SegmentChangeEventDetail } from "@ionic/core";
import { IonContent, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSlide, IonSlides } from "@ionic/react";
import Header from "../components/Header";
import CompanyCardList from "../components/CompanyCardList";
import { useTypedSelector } from "../store/store";
import { getCompanyTransportsList, onRetry } from "../utils/supervisionBackendData";
import SupervisionList from "./SupervisionList";
import "./Home.css";

const Home = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [currentSegment, setCurrentSegment] = useState<string>("0");
  const slidesRef = useRef<HTMLIonSlidesElement>(null);

  const {
    companyTransportsList = [],
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  // TODO use logged in user
  const supervisorUser = "USER1";

  useQuery(["getCompanyList"], () => getCompanyTransportsList(supervisorUser, dispatch), { retry: onRetry });

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

  const noNetworkNoData = isFailed.getCompanyList && companyTransportsList.length === 0;

  return (
    <IonPage>
      <Header title={t("main.header.title")} somethingFailed={isFailed.getCompanyList} />
      <IonSegment className="mainSegment" value={currentSegment} onIonChange={changeSlide}>
        <IonSegmentButton className="mainSegmentButton" value="0">
          <IonLabel>{`${t("main.tab.transportCompanies")} (${companyList.length})`}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton className="mainSegmentButton" value="1">
          <IonLabel>{`${t("main.tab.upcomingBridges")} (0)`}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonContent>
        <IonSlides ref={slidesRef} onIonSlideDidChange={changeSegment}>
          <IonSlide>
            <CompanyCardList companyList={companyTransportsList} noNetworkNoData={noNetworkNoData} />
          </IonSlide>
          <IonSlide>
            <SupervisionList />
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Home;
