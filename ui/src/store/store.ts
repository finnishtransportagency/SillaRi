import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createSelectorHook } from "react-redux";
import crossingsSlice from "./crossingsSlice";
import managementSlice from "./managementSlice";

const crossingsReducer = crossingsSlice.reducer;
const managementReducer = managementSlice.reducer;

const middleware = [...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })];

const store = configureStore({
  reducer: {
    crossingsReducer,
    managementReducer,
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector = createSelectorHook<RootState>();
export default store;
