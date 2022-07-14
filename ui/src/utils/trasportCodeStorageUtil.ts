import { SupervisionListType, TRANSPORT_CODE_STORAGE_GROUP } from "./constants";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";

export const constructStorageKey = (username: string, type: SupervisionListType, id: number): string => {
  // username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${username}_${type}_${id}`;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const savePasswordToStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  const today = formatDate(new Date());
  console.log();
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + today });
  return Storage.set({
    // username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
    key: constructStorageKey(username, type, id),
    // username + route transport password
    value: SHA1(`${username}${password}`).toString(),
  });
};

export const getPastDate = (daysAgo: number): string => {
  let d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return formatDate(d);
};

export const getPasswordFromStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  const today = formatDate(new Date());
  console.log("hello1");
  console.log(Storage.keys());
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + today });
  console.log("hello2");
  console.log(Storage.keys());
  const transportCodeStorageKey = `${username}_${SupervisionListType.TRANSPORT}_${id}`;
  const transportCode = await Storage.get({ key: transportCodeStorageKey });
};
