// audio/engine.ts — Module-singleton audio engine
//
// Owns ONE HTMLAudioElement reference + ONE AudioContext for the whole app
// lifecycle. Everything imperative (play, pause, seek, volume, building the
// Web Audio graph) lives here. Redux listener middleware drives it. React
// components never touch the AudioContext directly.

type AnalyserRef = { current: AnalyserNode | null };

class AudioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;

  /** Mutable ref — read by the Waveform on every animation frame. */
  readonly analyserRef: AnalyserRef = { current: null };

  attachElement(el: HTMLAudioElement | null): void {
    this.audioEl = el;
  }

  getElement(): HTMLAudioElement | null {
    return this.audioEl;
  }

  /**
   * Cross-origin audio without CORS gets silenced when routed through a
   * MediaElementAudioSourceNode, so only build the analyser graph for
   * sources we can safely connect.
   */
  private canUseWebAudio(): boolean {
    const audio = this.audioEl;
    if (!audio?.src) return false;
    try {
      const srcOrigin = new URL(audio.src, window.location.href).origin;
      if (srcOrigin === window.location.origin) return true;
      return (
        audio.crossOrigin === "anonymous" ||
        audio.crossOrigin === "use-credentials"
      );
    } catch {
      return false;
    }
  }

  /** Idempotent — only ever creates one AudioContext for the app. */
  ensureGraph(): void {
    if (this.ctx) return;
    if (!this.audioEl || !this.canUseWebAudio()) return;
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctor();
      const source = ctx.createMediaElementSource(this.audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      this.ctx = ctx;
      this.analyserRef.current = analyser;
    } catch (err) {
      console.warn("Audio engine: graph init failed", err);
    }
  }

  /** Must be called from a user-gesture call stack. */
  resume(): void {
    if (this.ctx?.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  play(): Promise<void> | undefined {
    return this.audioEl?.play();
  }

  pause(): void {
    this.audioEl?.pause();
  }

  seek(seconds: number): void {
    if (!this.audioEl) return;
    if (Number.isFinite(seconds)) this.audioEl.currentTime = seconds;
  }

  setVolume(volume: number): void {
    if (this.audioEl) this.audioEl.volume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    if (this.audioEl) this.audioEl.muted = muted;
  }

  setSrc(url: string): void {
    const audio = this.audioEl;
    if (!audio) return;
    if (audio.src !== url) {
      audio.src = url;
      audio.load();
    }
  }

  clearSrc(): void {
    const audio = this.audioEl;
    if (!audio) return;
    audio.removeAttribute("src");
    audio.load();
  }
}

export const audioEngine = new AudioEngine();
