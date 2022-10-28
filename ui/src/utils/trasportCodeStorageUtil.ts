import { SupervisionListType, TRANSPORT_CODE_STORAGE_GROUP, TRANSPORT_CODE_STORAGE_LIFE_DAYS } from "./constants";
import { Preferences } from "@capacitor/preferences";
import { SHA1 } from "crypto-js";
import IKeyValue from "../interfaces/IKeyValue";

const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const getPastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const getPrefixForAll = (): string => {
  return TRANSPORT_CODE_STORAGE_GROUP;
};

const getPrefixForDay = (day: Date): string => {
  const dayString = formatDate(day);
  const storageGroup = TRANSPORT_CODE_STORAGE_GROUP + "." + dayString;
  return storageGroup;
};

const getPrefixForToday = (): string => {
  return getPrefixForDay(new Date());
};

const getPrefixForDaysAgo = (days: number): string => {
  return getPrefixForDay(getPastDate(days));
};

const constructStorageKeyWithoutPrefix = (username: string, type: SupervisionListType, id: number): string => {
  //username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${username}_${type}_${id}`;
};

export const constructStorageKeyForAll = (username: string, type: SupervisionListType, id: number): string => {
  //username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${getPrefixForAll()}.${username}_${type}_${id}`;
};

const constructStorageKeyForDaysAgo = (username: string, type: SupervisionListType, id: number, days: number): string => {
  //username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${getPrefixForDaysAgo(days)}.${username}_${type}_${id}`;
};

const constructStorageKeyForToday = (username: string, type: SupervisionListType, id: number): string => {
  //username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${getPrefixForToday()}.${username}_${type}_${id}`;
};

export const savePasswordToStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  //remove if password is already under different date

  await Preferences.remove({ key: constructStorageKeyWithoutPrefix(username, type, id) });

  return Preferences.set({
    // username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
    key: constructStorageKeyForToday(username, type, id),
    // username + route transport password
    value: SHA1(`${username}${password}`).toString(),
  });
};

export const getPasswordFromStorage = async (username: string, type: SupervisionListType, id: number): Promise<string | null> => {
  console.log("getPasswordFromStorage");
  console.log(SupervisionListType);
  console.log(id);
  //we get only current cause maybe obsolete not removed yet
  for (let n = 0; n < TRANSPORT_CODE_STORAGE_LIFE_DAYS; n++) {
    const transportCode = await Preferences.get({ key: constructStorageKeyForDaysAgo(username, type, id, n) });
    if (transportCode.value) {
      console.log(transportCode.value);
      return transportCode.value;
    }
  }
  return null;
};

// TODO get list of keyValues from storage so that we configure storage only once?
export const getPasswordAndIdFromStorage = async (username: string, type: SupervisionListType, id: number): Promise<IKeyValue> => {
  console.log("getPasswordAndIdFromStorage");
  console.log(SupervisionListType);
  console.log(id);
  const code = await getPasswordFromStorage(username, type, id);
  console.log(code);
  return { key: id, value: code };
};

const isCurrent = (dateTimePart: string) => {
  for (let n = 0; n < TRANSPORT_CODE_STORAGE_LIFE_DAYS; n++) {
    if (formatDate(getPastDate(n)) === dateTimePart) {
      console.log("current date is: " + dateTimePart);
      return true;
    }
  }
  console.log("current date aint: " + dateTimePart);
  return false;
};

const removeIfObsolete = async (key: string) => {
  if (!key.includes(TRANSPORT_CODE_STORAGE_GROUP)) {
    return;
  }
  const splitted = key.split(".");
  const dateTimePart = splitted[0];
  if (!isCurrent(dateTimePart)) {
    await Preferences.remove({ key: key });
  }
};

export const removeObsoletePasswords = async () => {
  console.log("removeObsoletePasswords");
  const allKeys = await Preferences.keys();
  console.log(allKeys);
  allKeys.keys.forEach((k) => removeIfObsolete(k));
  console.log(allKeys);
};
