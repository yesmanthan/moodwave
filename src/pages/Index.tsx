
import { useEffect, useState } from "react";
import { NavBar } from "@/components/NavBar";
import { Player } from "@/components/Player";
import { MoodSelector } from "@/components/MoodSelector";
import { MusicCard } from "@/components/MusicCard";
import { getSongsByMood, getFallbackSongs } from "@/services/api";
import { useAppContext } from "@/contexts/AppContext";
import { Song } from "@/contexts/AppContext";
import { motion } from "framer-motion";
import { getMoodDescription } from "@/services/moodDetection";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

export default function Index() {
  const { selectedMood, recentlyPlayed } = useAppContext();
  const [moodSongs, setMoodSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchSongs() {
      if (selectedMood) {
        setLoading(true);
        try {
          const songs = await getSongsByMood(selectedMood);
          if (songs.length > 0) {
            setMoodSongs(songs);
          } else {
            // Fallback to local data if API returns empty
            setMoodSongs(getFallbackSongs(selectedMood));
          }
        } catch (error) {
          console.error("Error fetching songs:", error);
          setMoodSongs(getFallbackSongs(selectedMood));
        } finally {
          setLoading(false);
        }
      }
    }

    fetchSongs();
  }, [selectedMood]);

  return (
    <div className="min-h-screen bg-background relative pb-24 md:pb-20">
      <NavBar />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-8 md:mb-12 text-center">
              Find music for every mood
            </h1>
            
            <MoodSelector />
          </motion.div>
        </section>
        
        {/* Mood Songs */}
        {selectedMood && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold capitalize">
                  {selectedMood} Music
                </h2>
                <p className="text-sm text-muted-foreground max-w-md text-right">
                  {getMoodDescription(selectedMood)}
                </p>
              </div>
              
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {moodSongs.map((song) => (
                    <MusicCard key={song.id} song={song} />
                  ))}
                </div>
              )}
            </motion.div>
          </section>
        )}
        
        {/* Recently Played */}
        {recentlyPlayed.length > 0 && (
          <section className="mb-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Recently Played</h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {recentlyPlayed.slice(0, 5).map((song) => (
                  <MusicCard key={song.id} song={song} />
                ))}
              </div>
            </motion.div>
          </section>
        )}
      </main>
      
      <Player />
    </div>
  );
}
