import { OWNLIST_STORAGE_GROUP } from "./constants";
import { Preferences } from "@capacitor/preferences";

export const saveToOwnlist = async (username: string, supervisionIds: number[]) => {
  Preferences.configure({ group: OWNLIST_STORAGE_GROUP });
  const oldValue = await Preferences.get({ key: username });
  const oldOwnlist = oldValue.value;
  let oldIds: string[] = [];
  let newOwnList = "";
  let isFirstItem = true;
  if (oldOwnlist && oldOwnlist.length > 0) {
    newOwnList = oldOwnlist.slice();
    oldIds = oldOwnlist.split(",");
    isFirstItem = false;
  }

  supervisionIds.forEach((id) => {
    const idString = id.toString();
    if (!oldIds.find((s) => s === idString)) {
      if (!isFirstItem) {
        newOwnList += ",";
      }
      newOwnList += idString;
      isFirstItem = false;
    }
  });

  await Preferences.set({ key: username, value: newOwnList });
};

export const getOwnlistRaw = async (username: string) => {
  Preferences.configure({ group: OWNLIST_STORAGE_GROUP });
  const ownList = await Preferences.get({ key: username });
  if (ownList.value) {
    return ownList.value;
  }
  return null;
};

export const getOwnlist = async (username: string) => {
  Preferences.configure({ group: OWNLIST_STORAGE_GROUP });
  const ownListRaw = await Preferences.get({ key: username });
  const ownList: number[] = [];
  if (ownListRaw.value) {
    ownListRaw.value.split(",").forEach((id) => {
      ownList.push(Number(id));
    });
  }
  return ownList;
};
