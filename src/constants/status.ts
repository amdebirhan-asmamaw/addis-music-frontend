// constants/status.ts — Status configuration lookup (replaces switch statements)

import type { SongStatus, StatusConfig } from "../types/song";

const DEFAULT_STATUS: StatusConfig = {
  badge: "#f1f5f9 #475569",
  dot: "#94a3b8",
};

export const STATUS_CONFIG: Record<SongStatus, StatusConfig> = {
  LIVE: {
    badge: "#dcfce7 #16a34a",
    dot: "#22c55e",
  },
  PROCESSING: {
    badge: "#fef3c7 #d97706",
    dot: "#f59e0b",
  },
  DRAFT: {
    badge: "#f1f5f9 #475569",
    dot: "#94a3b8",
  },
};

export const getStatusColor = (status: string): string =>
  (STATUS_CONFIG[status as SongStatus] ?? DEFAULT_STATUS).badge;

export const getStatusDotColor = (status: string): string =>
  (STATUS_CONFIG[status as SongStatus] ?? DEFAULT_STATUS).dot;
