import { OWNLIST_STORAGE_GROUP } from "./constants";
import { Preferences } from "@capacitor/preferences";
import type { Dispatch } from "redux";
import { actions } from "../store/rootSlice";

function constructKey(username: string) {
  return OWNLIST_STORAGE_GROUP + "." + username;
}

export const saveToOwnlist = async (username: string, supervisionIds: number[], dispatch: Dispatch) => {
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

  let count = 0;
  supervisionIds.forEach((id) => {
    const idString = id.toString();
    if (!oldIds.find((s) => s === idString)) {
      if (!isFirstItem) {
        newOwnList += ",";
      }
      newOwnList += idString;
      count++;
      isFirstItem = false;
    }
  });

  dispatch({ type: actions.SET_OWNLIST_COUNT, payload: count });
  await Preferences.set({ key: constructKey(username), value: newOwnList });
};

export const removeFromOwnlist = async (username: string, supervisionId: number | undefined, dispatch: Dispatch) => {
  if (supervisionId) {
    const oldValue = await Preferences.get({ key: constructKey(username) });
    const oldOwnlist = oldValue.value;
    let oldIds: string[] = [];
    let newOwnList = "";
    if (oldOwnlist && oldOwnlist.length > 0) {
      oldIds = oldOwnlist.split(",");
      oldIds.forEach((id) => {
        if (Number(id) !== supervisionId) {
          newOwnList += id.toString() + ",";
        }
      });
    }

    newOwnList = newOwnList.substring(0, newOwnList.length - 1);
    const count = newOwnList.length > 0 ? newOwnList.split(",").length : 0;

    dispatch({ type: actions.SET_OWNLIST_COUNT, payload: count });
    return Preferences.set({ key: constructKey(username), value: newOwnList });
  }
};

export const getOwnlist = async (username: string, dispatch: Dispatch) => {
  const ownListRaw = await Preferences.get({ key: OWNLIST_STORAGE_GROUP + "." + username });
  const ownList: number[] = [];
  if (ownListRaw.value) {
    ownListRaw.value.split(",").forEach((id: string) => {
      ownList.push(Number(id));
    });
    const count = ownListRaw.value.split(",").length;
    dispatch({ type: actions.SET_OWNLIST_COUNT, payload: count });
  }
  return ownList;
};
