import { SupervisionListType, TRANSPORT_CODE_STORAGE_GROUP, TRANSPORT_CODE_PREFIX, TRANSPORT_CODE_STORAGE_LIFE_DAYS } from "./constants";
import { Storage } from "@capacitor/storage";
import { SHA1 } from "crypto-js";

export const constructStorageKey = (username: string, type: SupervisionListType, id: number): string => {
  // SILLARI_TRANSCODE + username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
  return TRANSPORT_CODE_PREFIX + `_${username}_${type}_${id}`;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().slice(0, 10);
};

export const configureStorageForAll = async () => {
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP });
};

export const configureStorageForDay = async (day: Date) => {
  const dayString = formatDate(new Date());
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + "." + dayString });
};

export const configureStorageForToday = async () => {
  await configureStorageForDay(new Date());
};

export const configureStorageForDaysAgo = async (days: number) => {
  await configureStorageForDay(getPastDate(days));
};

export const savePasswordToStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  await configureStorageForToday();
  return Storage.set({
    // SILLARI_TRANSCODE + username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
    key: constructStorageKey(username, type, id),
    // username + route transport password
    value: SHA1(`${username}${password}`).toString(),
  });
};

export const getPastDate = (daysAgo: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

export const getPasswordFromStorage = async (username: string, type: SupervisionListType, id: number): Promise<string | null> => {
  //we can get all transcodes cause obsolete have been removed
  await configureStorageForAll();
  const keys = await Storage.keys();
  console.log(keys);
  const transportCodeStorageKey = `${username}_${SupervisionListType.TRANSPORT}_${id}`;
  const transportCode = await Storage.get({ key: transportCodeStorageKey });
  return transportCode.value;
};

//get from storage password from TRANSPORT_CODE_STORAGE_LIFE_DAYS (3) past days
export const getNonObsoletePasswords = async () => {
  const nonObsoleteTransportCodes = [];
  for (let n = 0; n < TRANSPORT_CODE_STORAGE_LIFE_DAYS; n++) {
    await configureStorageForDaysAgo(n);
    const keysFromDate = await Storage.keys();
    console.log("keysFromDate:");
    console.log(keysFromDate);
    nonObsoleteTransportCodes.push(keysFromDate);
  }
  console.log("nonObsoleteTransportCodesResults:");
  console.log(nonObsoleteTransportCodes);
  return nonObsoleteTransportCodes.flatMap((keyResult) => keyResult.keys);
};

export const removeObsoletePasswords = async () => {
  const nonObsoleteTransportCodes: string[] = await getNonObsoletePasswords();
  console.log("nonObsoleteTransportCodes:");
  console.log(nonObsoleteTransportCodes);
  console.log(Storage);
  await configureStorageForAll();
  console.log(Storage);
  const keysToRemove = await Storage.keys();
  console.log("all keys:");
  console.log(keysToRemove);

  //dont remove keys that are in the new keys
  keysToRemove.keys.filter((key: string) => {
    return nonObsoleteTransportCodes.find((x) => x === key) === undefined;
  });
  console.log("keysToRemove:");
  console.log(keysToRemove);

  keysToRemove.keys.forEach((key) => Storage.remove({ key: key }));
};
