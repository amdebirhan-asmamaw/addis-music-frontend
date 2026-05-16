// pages/StatsPage.tsx — Statistics overview page

import { useEffect } from "react";
import StatsView from "../components/StatsView";
import { useSongStats } from "../hooks/useSongStats";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchSongs,
  selectSongs,
  selectSongsStatus,
} from "../store/songsSlice";

export default function StatsPage() {
  const dispatch = useAppDispatch();
  const songs = useAppSelector(selectSongs);
  const status = useAppSelector(selectSongsStatus);

  useEffect(() => {
    if (status === "idle") dispatch(fetchSongs());
  }, [dispatch, status]);

  const stats = useSongStats(songs);

  return <StatsView stats={stats} />;
}
