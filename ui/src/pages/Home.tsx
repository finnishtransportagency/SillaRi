import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SegmentChangeEventDetail } from "@ionic/core";
import { IonContent, IonIcon, IonLabel, IonPage, IonSegment, IonSegmentButton, IonSlide, IonSlides } from "@ionic/react";
import { barbellOutline, bus } from "ionicons/icons";
import Header from "../components/Header";
import CompanyCardList from "../components/CompanyCardList";
import "./Home.css";

const Home = (): JSX.Element => {
  const { t } = useTranslation();
  const [currentSegment, setCurrentSegment] = useState<string>("0");
  const slidesRef = useRef<HTMLIonSlidesElement>(null);

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

  return (
    <IonPage>
      <Header title={t("main.header.title")} />
      <IonSegment value={currentSegment} onIonChange={changeSlide}>
        <IonSegmentButton value="0">
          <IonIcon icon={bus} />
          <IonLabel>{t("main.tab.transportCompanies")}</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="1">
          <IonIcon icon={barbellOutline} />
          <IonLabel>{t("main.tab.upcomingBridges")}</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      <IonContent>
        <IonSlides ref={slidesRef} onIonSlideDidChange={changeSegment}>
          <IonSlide>
            <CompanyCardList />
          </IonSlide>
          <IonSlide>
            <div>TODO</div>
          </IonSlide>
        </IonSlides>
      </IonContent>
    </IonPage>
  );
};

export default Home;
