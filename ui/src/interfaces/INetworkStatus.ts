import IFailedQuery from "./IFailedQuery";

export default interface INetworkStatus {
  isFailed: IFailedQuery;

  // TODO - add other network statuses such as offline?
}
