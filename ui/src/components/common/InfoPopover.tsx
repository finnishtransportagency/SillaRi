import React, { Dispatch, SetStateAction } from "react";
import { IonButton, IonButtons, IonIcon, IonPopover, IonText, IonToolbar } from "@ionic/react";
import "./CustomAccordion.css";
import close from "../../theme/icons/close.svg";

interface InfoPopoverProps {
  triggerId: string;
  title: string;
  text: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const InfoPopover = ({ triggerId, title, text, isOpen, setOpen }: InfoPopoverProps): JSX.Element => {
  return (
    <IonPopover className="medium-popover" side="bottom" alignment="center" trigger={triggerId} isOpen={isOpen} onDidDismiss={() => setOpen(false)}>
      <IonToolbar>
        <IonText className="headingText ion-padding-start">{title}</IonText>
        <IonButtons slot="end">
          <IonButton onClick={() => setOpen(false)}>
            <IonIcon className="otherIconLarge" icon={close} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <p className="ion-no-margin ion-margin-bottom ion-margin-horizontal">{text}</p>
    </IonPopover>
  );
};

export default InfoPopover;
