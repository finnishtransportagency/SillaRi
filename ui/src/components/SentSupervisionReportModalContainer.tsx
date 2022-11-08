import React, { Dispatch, SetStateAction } from "react";
import "./SentSupervisionReportsAccordion.css";
import ISupervision from "../interfaces/ISupervision";
import { useQuery } from "react-query";
import { getSupervisionMaybeNoPasscode } from "../utils/supervisionBackendData";
import { onRetry } from "../utils/backendData";
import { useDispatch } from "react-redux";
import SupervisionReportModal from "./SupervisionReportModal";

interface SentSupervisionReportProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSupervisionId: number | undefined;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
  isCustomerUsesSillariPermitSupervision: boolean;
  setIsCustomerUsesSillariPermitSupervision: Dispatch<SetStateAction<boolean>>;
  username: string;
}

const SentSupervisionReportModalContainer = ({
  isOpen,
  setOpen,
  selectedSupervisionId,
  setSelectedSupervisionId,
  isCustomerUsesSillariPermitSupervision,
  setIsCustomerUsesSillariPermitSupervision,
  username,
}: SentSupervisionReportProps): JSX.Element => {
  const dispatch = useDispatch();

  const { data: supervision } = useQuery(
    ["getSupervision", Number(selectedSupervisionId)],
    () => getSupervisionMaybeNoPasscode(Number(selectedSupervisionId), isCustomerUsesSillariPermitSupervision, username, null, dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: !!username && selectedSupervisionId !== undefined,
      onSuccess: (data) => {
        console.log("GetSupervision done", data.id);
      },
      onError: () => {
        console.error("Fetching report fail", selectedSupervisionId);
      },
    }
  );

  const closeModal = () => {
    setSelectedSupervisionId(undefined);
    setOpen(false);
  };

  return <SupervisionReportModal isOpen={isOpen} supervision={supervision as ISupervision} closeModal={closeModal} />;
};

export default SentSupervisionReportModalContainer;
