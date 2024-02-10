import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import snackbarReducer from "./snackbarSlices";
import audioReducer from "./audioPlayerSlice";
import signinReducer from "./setSignInSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer,
  snackbar: snackbarReducer,
  audioplayer: audioReducer,
  signin: signinReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: "production",
});

export const persistor = persistStore(store);
