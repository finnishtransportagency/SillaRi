import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { createSelectorHook } from "react-redux";
import rootSlice from "./rootSlice";

const rootReducer = rootSlice.reducer;

const middleware = [...getDefaultMiddleware({ serializableCheck: false, immutableCheck: false })];

const store = configureStore({
  reducer: {
    rootReducer,
  },
  middleware,
});

export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector = createSelectorHook();
export default store;
