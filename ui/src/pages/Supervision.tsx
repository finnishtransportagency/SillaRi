import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { IonContent, IonPage } from "@ionic/react";
import Header from "../components/Header";
import NoNetworkNoData from "../components/NoNetworkNoData";
import SupervisionFooter from "../components/SupervisionFooter";
import SupervisionHeader from "../components/SupervisionHeader";
import SupervisionObservations from "../components/SupervisionObservations";
import SupervisionPhotos from "../components/SupervisionPhotos";
import ISupervision from "../interfaces/ISupervision";
import { useTypedSelector } from "../store/store";
import { getSupervision, onRetry, startSupervision } from "../utils/supervisionBackendData";
import ISupervisionReport from "../interfaces/ISupervisionReport";

interface SupervisionProps {
  supervisionId: string;
}

const Supervision = (): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [modifiedSupervisionReport, setModifiedSupervisionReport] = useState<ISupervisionReport | undefined>(undefined);

  const { supervisionId = "0" } = useParams<SupervisionProps>();

  const {
    networkStatus: { isFailed = {} },
  } = useTypedSelector((state) => state.supervisionReducer);

  const { data: supervision, isLoading: isLoadingSupervision } = useQuery(
    ["getSupervision", supervisionId],
    () => getSupervision(Number(supervisionId), dispatch),
    {
      retry: onRetry,
      onSuccess: (data) => {
        console.log("getSupervision setting report", data.report);
        setModifiedSupervisionReport(data.report);
      },
    }
  );

  // Set-up mutations for modifying data later
  const supervisionStartMutation = useMutation((initialReport: ISupervisionReport) => startSupervision(initialReport, dispatch), {
    retry: onRetry,
    onSuccess: (data) => {
      console.log("STARTED AND GOT NEW DATA", data);
      queryClient.setQueryData(["getSupervision", supervisionId], data);
    },
  });

  console.log("Supervision", supervision);
  console.log("ModifiedReport", modifiedSupervisionReport);

  // Start the supervision if supervision has loaded but report is null or undefined
  const { isLoading: isSendingSupervisionStart } = supervisionStartMutation;

  useEffect(() => {
    const { report: savedReport } = supervision || {};
    const { id: supervisionReportId = -1 } = savedReport || {};

    if (!isLoadingSupervision && !isSendingSupervisionStart && supervision && supervisionReportId < 0) {
      console.log("HELLO supervisionStart");

      const defaultReport: ISupervisionReport = {
        id: -1,
        supervisionId: Number(supervisionId),
        drivingLineOk: false,
        drivingLineInfo: "",
        speedLimitOk: false,
        speedLimitInfo: "",
        anomalies: true,
        anomaliesDescription: "",
        surfaceDamage: false,
        jointDamage: false,
        bendOrDisplacement: false,
        otherObservations: false,
        otherObservationsInfo: "",
        additionalInfo: "",
        draft: true,
      };
      supervisionStartMutation.mutate(defaultReport);
    }
  }, [isLoadingSupervision, isSendingSupervisionStart, supervisionStartMutation, supervisionId, supervision]);

  const noNetworkNoData = isFailed.getSupervision && supervision === undefined;

  return (
    <IonPage>
      <Header title={t("supervision.title")} somethingFailed={isFailed.getSupervision} />
      <IonContent fullscreen>
        {noNetworkNoData ? (
          <NoNetworkNoData />
        ) : (
          <>
            <SupervisionHeader supervision={supervision as ISupervision} className="header" isCrossingInstructionsIncluded />
            <SupervisionPhotos supervision={supervision as ISupervision} headingKey="supervision.photosDrivingLine" isButtonsIncluded />
            <SupervisionObservations
              modifiedSupervisionReport={modifiedSupervisionReport as ISupervisionReport}
              setModifiedSupervisionReport={setModifiedSupervisionReport}
            />
            {/*<SupervisionFooter supervision={supervision as ISupervision} report={modifiedSupervisionReport as ISupervisionReport} />*/}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Supervision;
