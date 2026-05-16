// store/index.ts — Redux store configuration

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";

import playerReducer from "./playerSlice";
import songsReducer from "./songsSlice";
import { playerListenerMiddleware } from "./playerListeners";
import rootSaga from "./rootSaga";

const rootReducer = combineReducers({
  player: playerReducer,
  songs: songsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        // File payloads ride on these saga-only actions; they never land
        // in state, so we silence RTK's serialisation warning for them.
        ignoredActions: ["songs/createSong", "songs/updateSong"],
      },
    })
      .prepend(playerListenerMiddleware.middleware)
      .concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
