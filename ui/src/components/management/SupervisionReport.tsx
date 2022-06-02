import React, { Dispatch, SetStateAction } from "react";
import { useDispatch } from "react-redux";
import { useQuery } from "react-query";
import { onRetry } from "../../utils/backendData";
import SupervisionReportModal from "../SupervisionReportModal";
import ISupervision from "../../interfaces/ISupervision";
import { getSupervisionOfTransportCompany } from "../../utils/managementBackendData";

interface SupervisionReportProps {
  isOpen: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  selectedSupervisionId: number | undefined;
  setSelectedSupervisionId: Dispatch<SetStateAction<number | undefined>>;
}

const SupervisionReport = ({ isOpen, setOpen, selectedSupervisionId, setSelectedSupervisionId }: SupervisionReportProps): JSX.Element => {
  const dispatch = useDispatch();

  const { data: supervision } = useQuery(
    ["getSupervisionOfTransportCompany", Number(selectedSupervisionId)],
    () => getSupervisionOfTransportCompany(Number(selectedSupervisionId), dispatch),
    {
      retry: onRetry,
      staleTime: Infinity,
      enabled: selectedSupervisionId !== undefined,
      onSuccess: (data) => {
        console.log("GetSupervisionOfTransportCompany done", data.id);
      },
    }
  );

  const closeModal = () => {
    setSelectedSupervisionId(undefined);
    setOpen(false);
  };

  return <SupervisionReportModal isOpen={isOpen} supervision={supervision as ISupervision} closeModal={closeModal} />;
};

export default SupervisionReport;
