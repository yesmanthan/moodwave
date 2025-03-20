
import { NavBar } from "@/components/NavBar";
import { Player } from "@/components/Player";
import { useAppContext } from "@/contexts/AppContext";
import { MusicCard } from "@/components/MusicCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Music, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function Library() {
  const { recentlyPlayed } = useAppContext();

  return (
    <div className="min-h-screen bg-background relative pb-24 md:pb-20">
      <NavBar />
      
      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Your Library</h1>
          
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Playlist</span>
          </Button>
        </div>
        
        <Tabs defaultValue="recent" className="mb-12">
          <TabsList className="grid w-full max-w-md grid-cols-3 mb-8">
            <TabsTrigger value="recent">Recently Played</TabsTrigger>
            <TabsTrigger value="playlists">Playlists</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-0">
            {recentlyPlayed.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {recentlyPlayed.map((song) => (
                    <MusicCard key={song.id} song={song} />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <Clock className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-xl font-medium mb-2">No recently played songs</h3>
                <p className="text-muted-foreground max-w-md">
                  Songs you play will appear here so you can easily find them again.
                </p>
              </motion.div>
            )}
          </TabsContent>
          
          <TabsContent value="playlists" className="mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Music className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
              <p className="text-muted-foreground max-w-md mb-4">
                Create playlists to organize your favorite songs.
              </p>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Playlist</span>
              </Button>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <Heart className="h-16 w-16 text-muted-foreground opacity-20 mb-4" />
              <h3 className="text-xl font-medium mb-2">No favorite songs</h3>
              <p className="text-muted-foreground max-w-md">
                Heart songs to add them to your favorites.
              </p>
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Player />
    </div>
  );
}

// Using lazy loading for the Heart icon
function Heart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}
