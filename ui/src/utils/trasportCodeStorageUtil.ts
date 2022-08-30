import { SupervisionListType, TRANSPORT_CODE_STORAGE_GROUP, TRANSPORT_CODE_STORAGE_LIFE_DAYS } from "./constants";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";
import IKeyValue from "../interfaces/IKeyValue";

export const constructStorageKey = (username: string, type: SupervisionListType, id: number): string => {
  //username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return `${username}_${type}_${id}`;
};

const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

const configureStorageForAll = async () => {
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP });
};

const configureStorageForDay = async (day: Date) => {
  const dayString = formatDate(day);
  const storageGroup = TRANSPORT_CODE_STORAGE_GROUP + "." + dayString;
  console.log("Config storage grouop: " + storageGroup);
  await Storage.configure({ group: storageGroup });
};

const configureStorageForToday = async () => {
  await configureStorageForDay(new Date());
};

const getPastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

const configureStorageForDaysAgo = async (days: number) => {
  await configureStorageForDay(getPastDate(days));
};

export const savePasswordToStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  //remove if password is already under different date
  await configureStorageForAll();
  await Storage.remove({ key: constructStorageKey(username, type, id) });

  await configureStorageForToday();
  return Storage.set({
    // username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
    key: constructStorageKey(username, type, id),
    // username + route transport password
    value: SHA1(`${username}${password}`).toString(),
  });
};

export const getPasswordFromStorage = async (username: string, type: SupervisionListType, id: number): Promise<string | null> => {
  //we get only current cause maybe obsolete not removed yet
  for (let n = 0; n < TRANSPORT_CODE_STORAGE_LIFE_DAYS; n++) {
    await configureStorageForDaysAgo(n);
    const transportCode = await Storage.get({ key: constructStorageKey(username, type, id) });
    if (transportCode.value) {
      return transportCode.value;
    }
  }
  return null;
};

// TODO get list of keyValues from storage so that we configure storage only once?
export const getPasswordAndIdFromStorage = async (username: string, type: SupervisionListType, id: number): Promise<IKeyValue> => {
  const code = await getPasswordFromStorage(username, type, id);
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
  const splitted = key.split(".");
  const dateTimePart = splitted[0];
  if (!isCurrent(dateTimePart)) {
    await Storage.remove({ key: key });
  }
};

export const removeObsoletePasswords = async () => {
  console.log("removeObsoletePasswords");
  await configureStorageForAll();
  const allKeys = await Storage.keys();
  allKeys.keys.forEach((k) => removeIfObsolete(k));
};
