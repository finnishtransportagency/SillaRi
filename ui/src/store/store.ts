import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createSelectorHook } from "react-redux";
import supervisionSlice from "./supervisionSlice";
import managementSlice from "./managementSlice";

const supervisionReducer = supervisionSlice.reducer;
const managementReducer = managementSlice.reducer;

const middleware = [...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })];

const store = configureStore({
  reducer: {
    supervisionReducer,
    managementReducer,
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector = createSelectorHook<RootState>();
export default store;
