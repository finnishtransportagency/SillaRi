import IFailedQuery from "./IFailedQuery";
import IFailedQueryStatus from "./IFailedQueryStatus";

export default interface INetworkStatus {
  isFailed: IFailedQuery;
  failedStatus: IFailedQueryStatus;
}
