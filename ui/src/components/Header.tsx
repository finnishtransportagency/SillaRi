import React from "react";
import { IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle } from "@ionic/react";
import "./Header.css";

const Header: React.FC<{ title: string }> = ({ title }: { title: string }) => {
  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton />
        </IonButtons>
        <IonTitle>{title}</IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;
