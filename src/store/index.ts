// store/index.ts — Redux store configuration

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import playerReducer from "./playerSlice";
import { playerListenerMiddleware } from "./playerListeners";

const rootReducer = combineReducers({
  player: playerReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault().prepend(playerListenerMiddleware.middleware),
});

export type AppDispatch = typeof store.dispatch;
