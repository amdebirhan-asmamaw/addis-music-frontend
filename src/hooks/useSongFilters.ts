// hooks/useSongFilters.ts — Search, genre filter, sort state + debounced filtering

import { useState, useMemo } from "react";
import { useDebounce } from "./useDebounce";
import type { Song } from "../types/song";

type SortOption = "newest" | "alphabetical" | "artist";

interface SongFiltersState {
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  selectedGenre: string;
  setSelectedGenre: React.Dispatch<React.SetStateAction<string>>;
  sortBy: SortOption;
  setSortBy: React.Dispatch<React.SetStateAction<SortOption>>;
  filteredSongs: Song[];
  isFiltered: boolean;
  clearFilters: () => void;
}

export function useSongFilters(songs: Song[]): SongFiltersState {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const debouncedQuery = useDebounce(searchQuery, 300);

  const filteredSongs = useMemo(() => {
    let result = [...songs];

    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase();
      result = result.filter(
        (song) =>
          song.title.toLowerCase().includes(q) ||
          song.artist.toLowerCase().includes(q) ||
          song.album.toLowerCase().includes(q),
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((song) => song.genre === selectedGenre);
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.title.localeCompare(b.title);
        case "artist":
          return a.artist.localeCompare(b.artist);
        default:
          return b.id - a.id;
      }
    });

    return result;
  }, [songs, debouncedQuery, selectedGenre, sortBy]);

  const isFiltered = searchQuery !== "" || selectedGenre !== "All";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedGenre("All");
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
    sortBy,
    setSortBy,
    filteredSongs,
    isFiltered,
    clearFilters,
  };
}
