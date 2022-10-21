import { OWNLIST_STORAGE_GROUP } from "./constants";
import { Preferences } from "@capacitor/preferences";
import ISupervision from "../interfaces/ISupervision";

export const saveToOwnlist = async (username: string, supervisions: ISupervision[]) => {
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

  supervisions.forEach((id) => {
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

export const getOwnlist = async (username: string) => {
  Preferences.configure({ group: OWNLIST_STORAGE_GROUP });
  const ownList = await Preferences.get({ key: username });
  if (ownList.value) {
    return ownList.value;
  }
  return null;
};
