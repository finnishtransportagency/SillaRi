import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import './SidebarMenu.css';
import { home, settings } from 'ionicons/icons';

interface ContainerProps { }

const SidebarMenu: React.FC<ContainerProps> = () => {
  return (
    <IonMenu disabled={false} hidden={false} side="start" content-id="MainContent">
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>SillaRi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          <IonMenuToggle>
            <IonItem routerLink="/home">
              <IonIcon icon={home} slot="start"></IonIcon>
              <IonLabel>Pääsivu</IonLabel>
            </IonItem>
          </IonMenuToggle>
          <IonMenuToggle>
            <IonItem routerLink="/settings">
              <IonIcon icon={settings} slot="start"></IonIcon>
              <IonLabel>Asetukset</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default SidebarMenu;
