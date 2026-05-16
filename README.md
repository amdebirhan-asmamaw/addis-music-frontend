# Addis Song — Frontend

A modern song catalog management dashboard built with **React 19**, **TypeScript**, **Emotion**, and **Redux Toolkit + Redux-Saga**. Features a rich UI for browsing, filtering, creating, editing, and deleting songs — with an integrated audio player.

**Live:** [addis-music-ebon.vercel.app](https://addis-music-ebon.vercel.app)

---

## Features

- 🎵 **Song Management** — Full CRUD with image & audio file uploads via FormData
- 🎧 **Integrated Audio Player** — Play, pause, skip, seek, and waveform visualization
- 🔍 **Search & Filter** — Real-time search, genre filtering, and multi-column sorting
- 📊 **Statistics Dashboard** — Aggregated stats: songs per genre, per artist, per album
- 🎨 **Artists & Albums Views** — Browse the catalog grouped by artist or album
- ⚡ **Responsive Design** — 1–4 column grid adapting to viewport width

---

## Tech Stack

| Layer           | Technology                                  |
| --------------- | ------------------------------------------- |
| **Framework**   | React 19 + TypeScript 6                     |
| **Bundler**     | Vite 8                                      |
| **Styling**     | Emotion (`@emotion/styled`) + styled-system |
| **State**       | Redux Toolkit + Redux-Saga                  |
| **Routing**     | React Router v7                             |
| **Validation**  | Zod                                         |
| **Icons**       | Lucide React                                |
| **Deployment**  | Vercel                                      |

---

## Project Structure

```
src/
├── api/                  # Typed API client (songApi.ts)
├── assets/               # Static assets
├── audio/                # Audio-related utilities
├── components/
│   ├── Header.tsx        # App header with search & navigation
│   ├── Player.tsx        # Persistent audio player bar
│   ├── PlayerAudio.tsx   # <audio> element controller
│   ├── Waveform.tsx      # Audio waveform visualization
│   ├── SongCard.tsx      # Song grid card component
│   ├── SongFormModal.tsx  # Create/edit song modal form
│   ├── DeleteConfirmModal.tsx
│   ├── StatsView.tsx     # Statistics display component
│   └── ui/               # Shared primitives (AddCard, etc.)
├── constants/            # Theme tokens, genres, status colors
├── features/             # Feature-level utilities
├── hooks/                # Custom hooks (useSongs, useSongFilters)
├── pages/
│   ├── SongsPage.tsx     # Main song management view
│   ├── StatsPage.tsx     # Statistics dashboard
│   ├── AlbumsPage.tsx    # Albums browse view
│   └── ArtistsPage.tsx   # Artists browse view
├── store/
│   ├── index.ts          # Store configuration
│   ├── hooks.ts          # Typed useDispatch / useSelector
│   ├── songsSlice.ts     # Songs state + async thunks
│   ├── songsSaga.ts      # Saga side-effects (fetch, create, update, delete)
│   ├── rootSaga.ts       # Root saga
│   ├── playerSlice.ts    # Audio player state
│   └── playerListeners.ts
├── types/                # TypeScript interfaces (Song, etc.)
├── utils/                # Utility functions
├── App.tsx               # Root layout with Outlet
├── router.tsx            # Route definitions
├── main.tsx              # Entry point
└── index.css             # Base styles
```

---

## Routes

| Path       | Page          | Description                    |
| ---------- | ------------- | ------------------------------ |
| `/`        | —             | Redirects to `/songs`          |
| `/songs`   | SongsPage     | Song grid with CRUD + filters  |
| `/stats`   | StatsPage     | Aggregated catalog statistics  |
| `/albums`  | AlbumsPage    | Songs grouped by album         |
| `/artists` | ArtistsPage   | Songs grouped by artist        |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **pnpm** (recommended) or npm

### Installation

```bash
# Clone
git clone https://github.com/amdebirhan-asmamaw/addis-music-frontend.git
cd addis-music-frontend

# Install dependencies
pnpm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api/v1
```

| Variable       | Description                  | Default                          |
| -------------- | ---------------------------- | -------------------------------- |
| `VITE_API_URL` | Backend API base URL         | `http://localhost:7000/api/v1`   |

### Development

```bash
pnpm run dev
```

Opens at `http://localhost:5173` by default.

### Production Build

```bash
pnpm run build
pnpm run preview
```

---

## State Management Architecture

```
Component → dispatch(action) → Redux Toolkit Slice → Saga (side-effect) → API Client → Backend
                                       ↓
                              Store update → Re-render
```

- **songsSlice** — Manages song list, loading/error states, and CRUD mutation flags
- **songsSaga** — Handles async API calls as saga workers, with automatic retry-on-error
- **playerSlice** — Manages playback state (queue, current track, play/pause, progress)

---

## Deployment (Vercel)

The project includes a `vercel.json` that rewrites all routes to `index.html` for client-side routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

Deploy with:

```bash
vercel --prod
```

---

## Backend

This frontend connects to the [Addis Song Backend](https://github.com/amdebirhan-asmamaw/addis-song-backend) — a Node.js/Express/MongoDB REST API with Cloudinary media uploads.

---

## License

MIT
