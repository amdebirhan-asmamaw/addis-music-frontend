// router.tsx — Application route configuration

import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import SongsPage from "./pages/SongsPage";
import StatsPage from "./pages/StatsPage";
import AlbumsPage from "./pages/AlbumsPage";
import ArtistsPage from "./pages/ArtistsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate to="/songs" replace />,
      },
      {
        path: "songs",
        element: <SongsPage />,
      },
      {
        path: "stats",
        element: <StatsPage />,
      },
      {
        path: "albums",
        element: <AlbumsPage />,
      },
      {
        path: "artists",
        element: <ArtistsPage />,
      },
    ],
  },
]);
