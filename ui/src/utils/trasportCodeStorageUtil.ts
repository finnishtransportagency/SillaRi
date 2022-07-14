import { SupervisionListType, TRANSPORT_CODE_STORAGE_GROUP } from "./constants";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";
import { contractSharp } from "ionicons/icons";

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
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDate(date);
};

export const getPasswordFromStorage = async (username: string, type: SupervisionListType, id: number) => {
  const today = formatDate(new Date());
  console.log("hello1" + type);
  const keys = await Storage.keys();
  console.log(keys);
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + today });
  const keys2 = await Storage.keys();
  console.log(keys2);
  const transportCodeStorageKey = `${username}_${SupervisionListType.TRANSPORT}_${id}`;
  const transportCode = await Storage.get({ key: transportCodeStorageKey });
};
