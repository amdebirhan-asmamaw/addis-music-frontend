// contexts/AudioEngineContext.tsx — Exposes the Web Audio analyser to the visualizer

import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react";

interface AudioEngineContextValue {
  analyser: AnalyserNode | null;
  setAnalyser: (node: AnalyserNode | null) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const AudioEngineContext = createContext<AudioEngineContextValue | null>(null);

export function AudioEngineProvider({ children }: { children: ReactNode }) {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const value = useMemo(
    () => ({ analyser, setAnalyser, audioRef }),
    [analyser],
  );

  return (
    <AudioEngineContext.Provider value={value}>
      {children}
    </AudioEngineContext.Provider>
  );
}

export function useAudioEngine() {
  const ctx = useContext(AudioEngineContext);
  if (!ctx) throw new Error("useAudioEngine must be used inside AudioEngineProvider");
  return ctx;
}
