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

export const savePasswordToStorage = async (username: string, id: number, password: string, type: SupervisionListType) => {
  const today = formatDate(new Date());
  console.log();
  await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + today });
  return Storage.set({
    // SILLARI_TRANSCODE + username + TRANSPORT/BRIDGE + routeTransportId/supervisionId
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

//get from storage password from 3 past days
export const getNonObsoletePasswords = async () => {
  const nonObsoleteTransportCodes = [];
  for (let n = 0; n < TRANSPORT_CODE_STORAGE_LIFE_DAYS; n++) {
    const date = getPastDate(n);
    console.log("HEllo:" + date);
    await Storage.configure({ group: TRANSPORT_CODE_STORAGE_GROUP + date });
    const keysFromDate = await Storage.keys();
    console.log("keysFromDate:" + keysFromDate);
    nonObsoleteTransportCodes.push(keysFromDate);
  }
  console.log("nonObsoleteTransportCodes:" + nonObsoleteTransportCodes);
  return nonObsoleteTransportCodes.flatMap((keyResult) => keyResult.keys);
};

export const removeObsoletePasswords = async () => {
  const nonObsoleteTransportCodes: string[] = await getNonObsoletePasswords();
  console.log("nonObsoleteTransportCodes:" + nonObsoleteTransportCodes);
  await Storage.configure({});
  const keysToRemove = await Storage.keys();
  console.log("keysToRemove:" + keysToRemove);

  //dont remove non related stuff from storage
  keysToRemove.keys.filter((key: string) => {
    return key.includes(TRANSPORT_CODE_PREFIX);
  });
  console.log("keysToRemove:" + keysToRemove);

  //dont remove keys that are in the new keys
  keysToRemove.keys.filter((key: string) => {
    return nonObsoleteTransportCodes.find((x) => x === key) === undefined;
  });
  console.log("keysToRemove filtered:" + keysToRemove);

  keysToRemove.keys.forEach((key) => Storage.remove({ key: key }));
};
