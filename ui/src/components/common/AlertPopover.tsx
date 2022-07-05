import React, { Dispatch, MouseEvent, SetStateAction } from "react";
import { useTranslation } from "react-i18next";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPopover,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import close from "../../theme/icons/close_large.svg";
import { warning } from "ionicons/icons";

interface AlertPopoverProps {
  title: string;
  text: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const AlertPopover = ({ title, text, isOpen, setOpen }: AlertPopoverProps): JSX.Element => {
  const { t } = useTranslation();

  const cancelChanges = (evt: MouseEvent) => {
    evt.stopPropagation();
    setOpen(false);
  };

  return (
    <IonPopover className="large-popover" isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonContent>
        <IonHeader className="ion-no-border">
          <IonToolbar color="light">
            <IonTitle className="headingText">{title}</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={(evt) => cancelChanges(evt as MouseEvent)}>
                <IonIcon className="otherIconLarge" icon={close} color="primary" />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>

        <IonGrid className="ion-no-padding ion-margin">
          <IonRow className="ion-margin-top">
            <IonCol>
              <IonItem className="ion-no-padding" lines="none">
                <IonIcon className="otherIcon" icon={warning} color="danger" slot="start" />
                <IonLabel className="itemLabel">{text}</IonLabel>
              </IonItem>
            </IonCol>
          </IonRow>
          <IonRow className="ion-margin-top ion-justify-content-end">
            <IonCol size-lg="4">
              <IonButton color="primary" expand="block" onClick={(evt) => cancelChanges(evt)}>
                {t("common.buttons.closeAlert")}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPopover>
  );
};

export default AlertPopover;
