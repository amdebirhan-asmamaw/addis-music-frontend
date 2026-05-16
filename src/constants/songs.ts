// constants/songs.ts — Initial seed data for development

import type { Song } from "../types/song";

export const INITIAL_SONGS: Song[] = [
  {
    id: 1,
    title: "Neon Horizons",
    artist: "Cyber Architect",
    album: "Synthwave Vol. 1",
    genre: "Electronic",
    duration: "04:32",
    status: "LIVE",
    image:
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    description: "High energy synthwave track.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Velvet Echoes",
    artist: "Luna Grey",
    album: "Midnight Sessions",
    genre: "Jazz Fusion",
    duration: "05:15",
    status: "PROCESSING",
    image:
      "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2022,
    description: "Smooth jazz with electronic elements.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Steel Rhythm",
    artist: "Forge",
    album: "Iron Works",
    genre: "Industrial",
    duration: "03:58",
    status: "DRAFT",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2024,
    description: "Heavy industrial beats.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Aether",
    artist: "Solstice",
    album: "Celestial Drift",
    genre: "Ambient",
    duration: "07:20",
    status: "LIVE",
    image:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2021,
    description: "Atmospheric soundscapes.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "Prism",
    artist: "Spectral",
    album: "Light & Shadow",
    genre: "Progressive",
    duration: "04:45",
    status: "LIVE",
    image:
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop",
    releaseYear: 2023,
    description: "Complex time signatures and melodies.",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];
