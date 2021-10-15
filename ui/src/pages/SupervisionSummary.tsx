import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "react-query";
import { useDispatch } from "react-redux";
import { IonContent, IonPage, IonToast } from "@ionic/react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionObservationsSummary from "../components/SupervisionObservationsSummary";
import SupervisionPhotos from "../components/SupervisionPhotos";
import IPermit from "../interfaces/IPermit";
import IRouteBridge from "../interfaces/IRouteBridge";
import ISupervision from "../interfaces/ISupervision";
import { actions as supervisionActions } from "../store/supervisionSlice";
import { useTypedSelector } from "../store/store";
import { getPermitOfRouteBridge, getRouteBridge, getSupervision, onRetry } from "../utils/supervisionBackendData";

interface SummaryProps {
  supervisionId: string;
}

const SupervisionSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SummaryProps>();
  const [toastMessage, setToastMessage] = useState("");

  const {
    selectedPermitDetail,
    selectedBridgeDetail,
    selectedSupervisionDetail,
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);
  const { routeBridgeId = "0", images: supervisionImages = [] } = selectedSupervisionDetail || {};

  const { isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch, selectedSupervisionDetail),
    { retry: onRetry }
  );

  // Use the enabled option to only fetch data when routeBridgeId is available
  useQuery(["getRouteBridge", routeBridgeId], () => getRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });
  useQuery(["getPermitOfRouteBridge", routeBridgeId], () => getPermitOfRouteBridge(Number(routeBridgeId), dispatch, selectedBridgeDetail), {
    retry: onRetry,
    enabled: Number(routeBridgeId) > 0,
  });

  useEffect(() => {
    if (!isLoadingSupervision) {
      // Remove any uploaded images from the camera images stored in redux
      dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: supervisionImages });
    }
  }, [isLoadingSupervision, supervisionImages, dispatch]);

  const noNetworkNoData =
    (isFailed.getSupervision && selectedSupervisionDetail === undefined) ||
    (isFailed.getRouteBridge && selectedBridgeDetail === undefined) ||
    (isFailed.getPermitOfRouteBridge && selectedPermitDetail === undefined);

  return (
    <IonPage>
      <Header
        title={t("supervision.summary.title")}
        somethingFailed={isFailed.getSupervision || isFailed.getRouteBridge || isFailed.getPermitOfRouteBridge}
      />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader
              permit={selectedPermitDetail as IPermit}
              routeBridge={selectedBridgeDetail as IRouteBridge}
              supervision={selectedSupervisionDetail as ISupervision}
            />
            <SupervisionPhotos supervision={selectedSupervisionDetail as ISupervision} headingKey="supervision.photos" />
            <SupervisionObservationsSummary supervision={selectedSupervisionDetail as ISupervision} />
            <SupervisionFooter supervision={selectedSupervisionDetail as ISupervision} draft={false} setToastMessage={setToastMessage} />
          </>
        )}

        <IonToast
          isOpen={toastMessage.length > 0}
          message={toastMessage}
          onDidDismiss={() => setToastMessage("")}
          duration={5000}
          position="top"
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default SupervisionSummary;
