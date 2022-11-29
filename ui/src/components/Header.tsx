import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useIsFetching, useIsMutating, useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonBadge, IonButton, IonButtons, IonHeader, IonIcon, IonMenuButton, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { arrowBackOutline, cloudDownloadOutline } from "ionicons/icons";
import outgoing from "../theme/icons/outgoing_white_no_badge.svg";
import { onRetry } from "../utils/backendData";
import { getSupervisionSendingList } from "../utils/supervisionBackendData";
import SendingList from "./SendingList";
import OfflineBanner from "./OfflineBanner";
// import UnsentOfflineModal from "./UnsentOfflineModal";
import "./Header.css";
import { isSupervisionSigned } from "../utils/supervisionUtil";
import ISupervision from "../interfaces/ISupervision";
import { RootState, useTypedSelector } from "../store/store";

interface HeaderProps {
  title: string;
  secondaryTitle?: string;
  titleStyle?: string;
  somethingFailed?: boolean;
  includeSendingList?: boolean;
  includeOfflineBanner?: boolean;
  // includeUnsentOfflineCheck?: boolean;
  confirmGoBack?: () => void;
}

const Header = ({
  title,
  secondaryTitle,
  titleStyle,
  somethingFailed,
  includeSendingList,
  includeOfflineBanner,
  // includeUnsentOfflineCheck,
  confirmGoBack,
}: HeaderProps): JSX.Element => {
  const history = useHistory();
  const { pathname } = useLocation();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const dispatch = useDispatch();

  const { forceOpenSendingList, supervisionOpenedFromSendingList } = useTypedSelector((state: RootState) => state.rootReducer);

  const { data: supervisionList = [] } = useQuery(["getSupervisionSendingList"], () => getSupervisionSendingList(dispatch), {
    retry: onRetry,
    staleTime: Infinity,
    enabled: includeSendingList,
  });

  const canGoBack = !pathname.includes("/supervisions") && pathname !== "/transport" && pathname !== "/management";
  const [isSendingListOpen, setSendingListOpen] = useState<boolean>(false);

  const goBackOrToSendingList = (): void => {
    console.log("supervisionOpenedFromSendingList: " + supervisionOpenedFromSendingList);
    if (supervisionOpenedFromSendingList) {
      setSendingListOpen(true);
    } else {
      history.goBack();
    }
  };

  const goBack: () => void = confirmGoBack !== undefined ? confirmGoBack : goBackOrToSendingList;

  const [sentSupervisions, setSentSupervisions] = useState<ISupervision[]>([]);
  const [unsentSupervisions, setUnsentSupervisions] = useState<ISupervision[]>([]);

  useEffect(() => {
    // Separate sent and unsent supervisions with useEffect instead of useQuery, since onSuccess is not called when using cached data
    if (supervisionList && supervisionList.length > 0) {
      const sent = supervisionList.filter((supervision) => {
        const { statusHistory = [] } = supervision || {};
        return isSupervisionSigned(statusHistory);
      });
      setSentSupervisions(sent);

      const unsent = supervisionList.filter((supervision) => {
        const { statusHistory = [] } = supervision || {};
        return !isSupervisionSigned(statusHistory);
      });
      setUnsentSupervisions(unsent);

      // Store whether a supervision was saved to the sending list when offline
      // Note: this only works if the user does not refresh the page after coming back online
      // NOTE: this has been removed until later as it's related to further development
      // setUnsentOfflineOpen(supervisionList.some((supervision) => supervision.savedOffline));

      //
      if (forceOpenSendingList && forceOpenSendingList === true) {
        setSendingListOpen(true);
      }
    }
  }, [supervisionList, forceOpenSendingList]);

  const isGettingData = isFetching > 0;
  const isSendingData = isMutating > 0;

  useEffect(() => {
    // The cloud icons have been removed, so just write the info to the console instead
    console.log("fetching from backend", isGettingData, "- sending to backend", isSendingData, "- something failed", somethingFailed);
  }, [isGettingData, isSendingData, somethingFailed]);

  return (
    <IonHeader>
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonMenuButton className={canGoBack ? "ion-hide" : ""} />
          <IonButton shape="round" className={canGoBack ? "" : "ion-hide"} onClick={() => goBack()}>
            <IonIcon slot="icon-only" icon={arrowBackOutline} />
          </IonButton>
        </IonButtons>
        <IonTitle className={titleStyle}>{title}</IonTitle>
        {secondaryTitle && (
          <IonText slot="end" className={`${titleStyle} ion-margin-end`}>
            {secondaryTitle}
          </IonText>
        )}
        <IonButtons slot="end">
          <IonIcon slot="icon-only" icon={cloudDownloadOutline} className={`cloudIcon ${isFetching > 0 ? "" : "ion-hide"}`} />
          {includeSendingList && (
            <IonButton shape="round" className="otherIcon" onClick={() => setSendingListOpen(true)}>
              <IonBadge className="iconBadge" color="secondary">
                {unsentSupervisions.length}
              </IonBadge>
              <IonIcon slot="icon-only" icon={outgoing} />
            </IonButton>
          )}
        </IonButtons>

        {includeSendingList && (
          <SendingList
            isOpen={isSendingListOpen}
            setOpen={setSendingListOpen}
            sentSupervisions={sentSupervisions}
            unsentSupervisions={unsentSupervisions}
          />
        )}

        {/*
        // NOTE: this has been removed until later as it's related to further development
        includeUnsentOfflineCheck && (
          <UnsentOfflineModal
            isUnsentOfflineOpen={isUnsentOfflineOpen}
            setUnsentOfflineOpen={setUnsentOfflineOpen}
            setSendingListOpen={setSendingListOpen}
          />
        )
        */}
      </IonToolbar>

      {includeOfflineBanner && <OfflineBanner />}
    </IonHeader>
  );
};

Header.defaultProps = {
  secondaryTitle: undefined,
  titleStyle: "headingText",
  somethingFailed: false,
  includeSendingList: false,
  includeOfflineBanner: false,
  // includeUnsentOfflineCheck: false,
};

export default Header;
