import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButtons, IonMenuButton, IonItem, IonLabel, IonList, IonListHeader, IonRadio, IonRadioGroup } from '@ionic/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import './Settings.css';



const Settings: React.FC = () => {

  const { t } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonMenuButton></IonMenuButton>
          </IonButtons>
          <IonTitle>{t('settings.header.title')}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonRadioGroup value={i18n.language} onIonChange={e => changeLanguage(e.detail.value)}>
            <IonListHeader color="secondary">
              <IonLabel>{t('settings.language.label')}</IonLabel>
            </IonListHeader>

            <IonItem>
              <IonLabel>{t('settings.language.fi')}</IonLabel>
              <IonRadio slot="start" value="fi" />
            </IonItem>

            <IonItem>
              <IonLabel>{t('settings.language.sv')}</IonLabel>
              <IonRadio slot="start" value="sv" />
            </IonItem>

            <IonItem>
              <IonLabel>{t('settings.language.en')}</IonLabel>
              <IonRadio slot="start" value="en" />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
