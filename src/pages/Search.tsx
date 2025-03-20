
import { useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Player } from "@/components/Player";
import { MusicCard } from "@/components/MusicCard";
import { searchSongs } from "@/services/api";
import { Song } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, Loader2, MusicIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) return;
    
    setLoading(true);
    setHasSearched(true);
    
    try {
      const songs = await searchSongs(query);
      setResults(songs);
    } catch (error) {
      console.error("Error searching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative pb-24 md:pb-20">
      <NavBar />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search</h1>
          
          <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for songs, artists..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 h-12 bg-background border border-border rounded-xl"
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded-xl" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>
        
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16"
            >
              <Loader2 className="h-16 w-16 text-primary animate-spin mb-4" />
              <p className="text-muted-foreground">Searching for "{query}"...</p>
            </motion.div>
          ) : hasSearched ? (
            results.length > 0 ? (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-medium mb-6">
                  Results for "{query}"
                </h2>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {results.map((song) => (
                    <MusicCard key={song.id} song={song} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <MusicIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-medium mb-2">No results found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn't find any songs matching "{query}". Try a different search term.
                </p>
              </motion.div>
            )
          ) : (
            <motion.div
              key="start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <SearchIcon className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-medium mb-2">Search for music</h3>
              <p className="text-muted-foreground max-w-md">
                Type in the search box above to find your favorite songs and artists.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      <Player />
    </div>
  );
}
