import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import MainPageContainer from '../components/MainPageContainer';
import './Home.css';

const Home: React.FC = () => {

  const { t } = useTranslation();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('main.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <MainPageContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
