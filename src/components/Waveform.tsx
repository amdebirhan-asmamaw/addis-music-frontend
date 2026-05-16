// components/Waveform.tsx — Real-time frequency-bar visualizer

import { useEffect, useRef } from "react";
import { useAudioEngine } from "../contexts/AudioEngineContext";
import { useAppSelector } from "../store/hooks";

interface WaveformProps {
  width?: number;
  height?: number;
  barCount?: number;
}

export default function Waveform({
  width = 360,
  height = 36,
  barCount = 40,
}: WaveformProps) {
  const { analyser } = useAudioEngine();
  const isPlaying = useAppSelector((s) => s.player.isPlaying);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const drawIdle = () => {
      ctx.clearRect(0, 0, width, height);
      const gap = 3;
      const barWidth = (width - gap * (barCount - 1)) / barCount;
      ctx.fillStyle = "rgba(0, 85, 255, 0.15)";
      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + gap);
        const h = 4;
        const y = (height - h) / 2;
        ctx.fillRect(x, y, barWidth, h);
      }
    };

    if (!analyser || !isPlaying) {
      drawIdle();
      return;
    }

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const step = Math.max(1, Math.floor(bufferLength / barCount));

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, width, height);

      const gap = 3;
      const barWidth = (width - gap * (barCount - 1)) / barCount;

      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += dataArray[i * step + j] ?? 0;
        }
        const avg = sum / step;
        const intensity = avg / 255;
        const barHeight = Math.max(2, intensity * height);
        const x = i * (barWidth + gap);
        const y = (height - barHeight) / 2;
        const alpha = 0.35 + intensity * 0.65;
        ctx.fillStyle = `rgba(0, 85, 255, ${alpha.toFixed(3)})`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [analyser, isPlaying, width, height, barCount]);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
}
