import React from 'react';
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from '@ionic/react';
import './Header.css';

const Header: React.FC<{title: string}> = (props) => {

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton></IonMenuButton>
        </IonButtons>
        <IonTitle>{props.title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
