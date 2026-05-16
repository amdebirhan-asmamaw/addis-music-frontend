// constants/theme.ts — Shared design tokens

export const colors = {
  // Neutrals
  slate50: "#f8fafc",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate900: "#0f172a",

  // Brand
  primary: "#0055FF",
  primaryHover: "#1d4ed8",
  primaryLight: "#eff6ff",
  primaryLighter: "#bfdbfe",

  // Semantic
  danger: "#ef4444",
  dangerHover: "#dc2626",
  dangerBg: "#fef2f2",

  // Backgrounds
  pageBg: "#F8FAFC",
  cardBg: "#ffffff",
} as const;

export const radii = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  full: "9999px",
} as const;

export const fontSizes = {
  xs: "11px",
  sm: "13px",
  base: "14px",
  md: "15px",
  lg: "18px",
  xl: "20px",
  "2xl": "30px",
  "3xl": "42px",
} as const;

export const fontWeights = {
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const;
