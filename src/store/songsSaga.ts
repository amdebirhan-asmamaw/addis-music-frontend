// store/songsSaga.ts — Redux-saga worker chain for songs CRUD
//
// Effects use `call` for the HTTP layer and `put` to publish reducer
// actions. `takeLatest` is the right strategy for fetching (cancel
// previous), while mutations use `takeEvery` so optimistic concurrent
// edits from different rows don't get dropped.

import {
  call,
  put,
  takeEvery,
  takeLatest,
  type SagaReturnType,
} from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import { ApiError, songApi } from "../api/songApi";
import {
  createSong,
  createSongFailed,
  createSongPending,
  createSongSucceeded,
  deleteSong,
  deleteSongFailed,
  deleteSongPending,
  deleteSongSucceeded,
  fetchSongs,
  fetchSongsFailed,
  fetchSongsPending,
  fetchSongsSucceeded,
  updateSong,
  updateSongFailed,
  updateSongPending,
  updateSongSucceeded,
  type CreateSongPayload,
  type UpdateSongPayload,
} from "./songsSlice";

function describe(err: unknown): string {
  if (err instanceof ApiError) {
    if (Array.isArray(err.details)) return err.details.join("; ");
    return err.details || err.message;
  }
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// ─── Workers ───────────────────────────────────────────────────────

function* fetchSongsWorker() {
  yield put(fetchSongsPending());
  try {
    const songs: SagaReturnType<typeof songApi.list> = yield call(
      songApi.list,
    );
    yield put(fetchSongsSucceeded(songs));
  } catch (err) {
    yield put(fetchSongsFailed(describe(err)));
  }
}

function* createSongWorker(action: PayloadAction<CreateSongPayload>) {
  yield put(createSongPending());
  try {
    const song: SagaReturnType<typeof songApi.create> = yield call(
      songApi.create,
      action.payload.text,
      {
        image: action.payload.imageFile ?? null,
        audio: action.payload.audioFile ?? null,
      },
    );
    yield put(createSongSucceeded(song));
  } catch (err) {
    yield put(createSongFailed(describe(err)));
  }
}

function* updateSongWorker(action: PayloadAction<UpdateSongPayload>) {
  yield put(updateSongPending());
  try {
    const song: SagaReturnType<typeof songApi.update> = yield call(
      songApi.update,
      action.payload.id,
      action.payload.text,
      {
        image: action.payload.imageFile ?? null,
        audio: action.payload.audioFile ?? null,
      },
    );
    yield put(updateSongSucceeded(song));
  } catch (err) {
    yield put(updateSongFailed(describe(err)));
  }
}

function* deleteSongWorker(action: PayloadAction<string>) {
  yield put(deleteSongPending());
  try {
    yield call(songApi.remove, action.payload);
    yield put(deleteSongSucceeded(action.payload));
  } catch (err) {
    yield put(deleteSongFailed(describe(err)));
  }
}

// ─── Watcher ───────────────────────────────────────────────────────

export default function* songsSaga() {
  yield takeLatest(fetchSongs.type, fetchSongsWorker);
  yield takeEvery(createSong.type, createSongWorker);
  yield takeEvery(updateSong.type, updateSongWorker);
  yield takeEvery(deleteSong.type, deleteSongWorker);
}
