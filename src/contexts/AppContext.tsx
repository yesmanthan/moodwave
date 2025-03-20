import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

export type Mood = 
  | "happy" 
  | "sad" 
  | "relaxed" 
  | "energetic" 
  | "romantic" 
  | "angry" 
  | "chill" 
  | "focused" 
  | "excited" 
  | "sleepy" 
  | "motivated";

export type Song = {
  id: string;
  title: string;
  artist: string;
  albumArt?: string;
  duration: number;
  url?: string;
  mood?: Mood;
};

type AppContextType = {
  currentSong: Song | null;
  setCurrentSong: (song: Song | null) => void;
  queue: Song[];
  addToQueue: (song: Song) => void;
  removeFromQueue: (songId: string) => void;
  clearQueue: () => void;
  playNext: () => void;
  playPrevious: () => void;
  isPlaying: boolean;
  togglePlayPause: () => void;
  selectedMood: Mood | null;
  setSelectedMood: (mood: Mood | null) => void;
  volume: number;
  setVolume: (volume: number) => void;
  progress: number;
  setProgress: (progress: number) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  recentlyPlayed: Song[];
  addToRecentlyPlayed: (song: Song) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [queue, setQueue] = useState<Song[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [volume, setVolume] = useState(0.8);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>([]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const addToQueue = (song: Song) => {
    setQueue([...queue, song]);
    toast.success(`${song.title} added to queue`);
  };

  const removeFromQueue = (songId: string) => {
    setQueue(queue.filter(song => song.id !== songId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const playNext = () => {
    if (queue.length > 0) {
      const nextSong = queue[0];
      if (currentSong) {
        addToRecentlyPlayed(currentSong);
      }
      setCurrentSong(nextSong);
      setQueue(queue.slice(1));
      setIsPlaying(true);
    } else if (currentSong) {
      // No more songs in queue
      addToRecentlyPlayed(currentSong);
      setCurrentSong(null);
      setIsPlaying(false);
    }
  };

  const playPrevious = () => {
    if (recentlyPlayed.length > 0) {
      const previousSong = recentlyPlayed[recentlyPlayed.length - 1];
      if (currentSong) {
        setQueue([currentSong, ...queue]);
      }
      setCurrentSong(previousSong);
      setRecentlyPlayed(recentlyPlayed.slice(0, -1));
      setIsPlaying(true);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const addToRecentlyPlayed = (song: Song) => {
    // Only keep the 20 most recent songs
    const updatedRecent = [
      song,
      ...recentlyPlayed.filter(s => s.id !== song.id)
    ].slice(0, 20);
    
    setRecentlyPlayed(updatedRecent);
  };

  return (
    <AppContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        queue,
        addToQueue,
        removeFromQueue,
        clearQueue,
        playNext,
        playPrevious,
        isPlaying,
        togglePlayPause,
        selectedMood,
        setSelectedMood,
        volume,
        setVolume,
        progress,
        setProgress,
        theme,
        toggleTheme,
        recentlyPlayed,
        addToRecentlyPlayed,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};
