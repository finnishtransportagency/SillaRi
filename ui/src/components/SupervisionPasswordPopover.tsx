import React, { Dispatch, SetStateAction, useState } from "react";
import { IonButton, IonButtons, IonCol, IonGrid, IonIcon, IonPopover, IonRow, IonText, IonToolbar } from "@ionic/react";
import { useTranslation } from "react-i18next";
import close from "../theme/icons/close.svg";
import TransportCodeInput from "./TransportCodeInput";

interface SupervisionPasswordPopoverProps {
  triggerId: string;
  title: string;
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  openSupervision: () => void;
}

const SupervisionPasswordPopover = ({ triggerId, title, isOpen, setOpen, openSupervision }: SupervisionPasswordPopoverProps): JSX.Element => {
  const { t } = useTranslation();

  const [codeInputValue, setCodeInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [supervisionUnlocked, setSupervisionUnlocked] = useState<boolean>(false);

  /* UGLY BUG FIX
  Ionic popover does not close when navigating to another page, despite that setOpen(false) is called
  either before openSupervision or after that (or even inside openSupervision before or after history.push).
  The work around is currently:
  - Check the password when it's submitted and close the popover if it checks out
  - Catch the dismiss event in popover native event
  - If supervision has been unlocked, navigate from the page with openSupervision
  */
  const handleSubmitPassword = () => {
    if (codeInputValue) {
      // TODO send password to backend and check it there
      // need to pass method from parent component, since TransportCard and BridgeCard should call different methods
      //const routeTransportPassword = await findRouteTransportPassword(codeInputValue, dispatch);

      // TODO what value are we checking from previous method? Can those send the same simple value as response?
      // if (routeTransportPassword.routeTransportId) {
      setErrorMessage("");
      // TODO set password to storage (?) and mark supervision/supervisions as unlocked in storage
      setSupervisionUnlocked(true);
      setOpen(false);
      // } else {
      //   setErrorMessage(t("transports.transportCodeInput.invalidCodeErrorMessage"));
      // }
    }
  };

  const dismissPopover = () => {
    if (supervisionUnlocked) {
      openSupervision();
    }
  };

  return (
    <IonPopover trigger={triggerId} isOpen={isOpen} size="cover" side="top" alignment="start" onDidDismiss={() => dismissPopover()}>
      <>
        <IonToolbar>
          <p className="headingText ion-padding-start">{title}</p>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpen(false)}>
              <IonIcon className="otherIconLarge" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonGrid className="ion-no-padding ion-no-margin ion-margin-bottom" fixed>
          <TransportCodeInput
            codeInputValue={codeInputValue}
            setCodeInputValue={setCodeInputValue}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            submitPassword={() => handleSubmitPassword()}
          />
          <IonRow>
            <IonCol className="ion-text-center ion-margin">
              <IonText className="linkText" onClick={() => setOpen(false)}>
                {t("common.buttons.close")}
              </IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </>
    </IonPopover>
  );
};

export default SupervisionPasswordPopover;
