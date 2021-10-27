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
import ISupervision from "../interfaces/ISupervision";
import { actions as supervisionActions } from "../store/supervisionSlice";
import { useTypedSelector } from "../store/store";
import { getSupervision, onRetry } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SummaryProps {
  supervisionId: string;
}

const SupervisionSummary = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { supervisionId = "0" } = useParams<SummaryProps>();
  const [toastMessage, setToastMessage] = useState("");

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    { retry: onRetry }
  );
  const { images: savedImages = [], report } = supervision || {};

  useEffect(() => {
    if (!isLoadingSupervision) {
      // Remove any uploaded images from the camera images stored in redux
      dispatch({ type: supervisionActions.UPDATE_IMAGES, payload: savedImages });
    }
  }, [isLoadingSupervision, savedImages, dispatch]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.summary.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photos" />
            <SupervisionObservationsSummary supervision={supervision as ISupervision} />
            <SupervisionFooter supervision={supervision as ISupervision} report={report as ISupervisionReport} setToastMessage={setToastMessage} />
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
