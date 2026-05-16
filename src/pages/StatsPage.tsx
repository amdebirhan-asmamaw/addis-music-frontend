// pages/StatsPage.tsx — Statistics overview page

import StatsView from "../components/StatsView";
import { useSongStats } from "../hooks/useSongStats";
import { INITIAL_SONGS } from "../constants/songs";

export default function StatsPage() {
  const stats = useSongStats(INITIAL_SONGS);

  return <StatsView stats={stats} />;
}
