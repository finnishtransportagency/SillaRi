import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import Header from '../components/Header';
import MainPageContainer from '../components/MainPageContainer';
import './Home.css';

const Home: React.FC = () => {

  const { t } = useTranslation();

  return (
    <IonPage>
      <Header title={t('main.header.title')} />
      <IonContent fullscreen>
        <MainPageContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
