import React, { Dispatch, SetStateAction } from "react";
import "./SentSupervisionReportsAccordion.css";
import ISupervision from "../interfaces/ISupervision";
import { useQuery } from "react-query";
import { getSupervision } from "../utils/supervisionBackendData";
import { onRetry } from "../utils/backendData";
import { useDispatch } from "react-redux";
import SupervisionReportModal from "./SupervisionReportModal";

interface SentSupervisionReportProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSupervisionId: number | undefined;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
}

const SentSupervisionReport = ({ isOpen, setOpen, selectedSupervisionId, setSelectedSupervisionId }: SentSupervisionReportProps): JSX.Element => {
  const dispatch = useDispatch();

  const { data: supervision } = useQuery(
    ["getSupervision", Number(selectedSupervisionId)],
    () => getSupervision(Number(selectedSupervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: selectedSupervisionId !== undefined,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id);
      },
    }
  );

  const closeModal = () => {
    setSelectedSupervisionId(undefined);
    setOpen(false);
  };

  return <SupervisionReportModal isOpen={isOpen} supervision={supervision as ISupervision} closeModal={closeModal} />;
};

export default SentSupervisionReport;
