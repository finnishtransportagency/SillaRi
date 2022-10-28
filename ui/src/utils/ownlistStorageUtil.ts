import { OWNLIST_STORAGE_GROUP } from "./constants";
import { Preferences } from "@capacitor/preferences";

export const saveToOwnlist = async (username: string, supervisionIds: number[]) => {
  const oldValue = await Preferences.get({ key: OWNLIST_STORAGE_GROUP + "." + username });
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

function constructKey(username: string) {
  return OWNLIST_STORAGE_GROUP + "." + username;
}

export const removeFromOwnlist = async (username: string, supervisionId: number | undefined) => {
  if (supervisionId) {
    const oldValue = await Preferences.get({ key: constructKey(username) });
    const oldOwnlist = oldValue.value;
    console.log("oldOwnlist");
    console.log(oldOwnlist);
    let oldIds: string[] = [];
    let newOwnList = "";
    if (oldOwnlist && oldOwnlist.length > 0) {
      oldIds = oldOwnlist.split(",");
      console.log("oldIds");
      console.log(oldIds);
      oldIds.forEach((id) => {
        if (Number(id) !== supervisionId) {
          newOwnList += id.toString() + ",";
          console.log("newOwnList");
          console.log(newOwnList);
        }
      });
    }
    console.log(newOwnList);
    newOwnList = newOwnList.substring(0, newOwnList.length - 1);
    console.log(newOwnList);
    return Preferences.set({ key: constructKey(username), value: newOwnList });
  }
};

export const getOwnlist = async (username: string) => {
  const ownListRaw = await Preferences.get({ key: OWNLIST_STORAGE_GROUP + "." + username });
  const ownList: number[] = [];
  if (ownListRaw.value) {
    ownListRaw.value.split(",").forEach((id: string) => {
      ownList.push(Number(id));
    });
  }
  return ownList;
};
