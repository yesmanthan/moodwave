
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  ChevronDown,
  ListMusic,
  Heart,
  Share2,
  MoreHorizontal,
  Shuffle,
  Repeat
} from "lucide-react";
import { MusicCard } from "@/components/MusicCard";
import { motion, AnimatePresence } from "framer-motion";
import { getLyrics } from "@/services/api";
import { formatTime } from "@/lib/utils";

export default function PlayerPage() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlayPause,
    playNext,
    playPrevious,
    volume,
    setVolume,
    progress,
    queue
  } = useAppContext();
  
  const [lyrics, setLyrics] = useState<string | null>(null);
  const [isLyricsLoading, setIsLyricsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // If there's no current song, redirect to home
    if (!currentSong) {
      navigate("/");
      return;
    }
    
    // Fetch lyrics for the current song
    async function fetchLyrics() {
      if (currentSong) {
        setIsLyricsLoading(true);
        try {
          const songLyrics = await getLyrics(currentSong.artist, currentSong.title);
          setLyrics(songLyrics);
        } catch (error) {
          console.error("Error fetching lyrics:", error);
          setLyrics(null);
        } finally {
          setIsLyricsLoading(false);
        }
      }
    }
    
    fetchLyrics();
  }, [currentSong, navigate]);
  
  if (!currentSong) return null;
  
  const mainImageVariants = {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    exit: { scale: 0.9, opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-16 flex items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="rounded-full"
        >
          <ChevronDown className="h-6 w-6" />
        </Button>
      </div>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 max-w-3xl mx-auto w-full">
        {/* Album Art */}
        <motion.div
          key={currentSong.id}
          variants={mainImageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-xl mb-8"
        >
          <img 
            src={currentSong.albumArt || "https://picsum.photos/seed/music/600"} 
            alt={currentSong.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
        
        {/* Song Info */}
        <div className="w-full text-center mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSong.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-2">{currentSong.title}</h1>
              <p className="text-muted-foreground">{currentSong.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Progress */}
        <div className="w-full mb-6">
          <Slider
            value={[progress]}
            max={100}
            step={0.1}
            className="mb-2"
            // We don't handle seek here since it's controlled by the Player component
          />
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <div>
              {formatTime(currentSong.duration * (progress / 100))}
            </div>
            <div>
              {formatTime(currentSong.duration)}
            </div>
          </div>
        </div>
        
        {/* Controls */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full"
            >
              <Shuffle className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={playPrevious}
              className="h-12 w-12 rounded-full hover:bg-secondary"
            >
              <SkipBack className="h-6 w-6" />
            </Button>
            
            <Button 
              size="icon" 
              onClick={togglePlayPause}
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary/90"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8 fill-white" />
              ) : (
                <Play className="h-8 w-8 fill-white ml-1" />
              )}
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              onClick={playNext}
              className="h-12 w-12 rounded-full hover:bg-secondary"
            >
              <SkipForward className="h-6 w-6" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-10 w-10 rounded-full"
            >
              <Repeat className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button 
              size="icon" 
              variant="ghost"
              className="h-10 w-10 rounded-full"
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            >
              {volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </Button>
            
            <Slider
              className="w-32"
              value={[volume * 100]}
              max={100}
              step={1}
              onValueChange={(value) => setVolume(value[0] / 100)}
            />
            
            <Button 
              size="icon" 
              variant="ghost"
              className="h-10 w-10 rounded-full"
            >
              <Heart className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              className="h-10 w-10 rounded-full"
            >
              <Share2 className="h-5 w-5" />
            </Button>
            
            <Button 
              size="icon" 
              variant="ghost"
              className="h-10 w-10 rounded-full"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Lyrics or Queue */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Lyrics</h2>
            {queue.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ListMusic className="h-4 w-4" />
                <span>Next in queue: {queue.length}</span>
              </div>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {isLyricsLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-40 flex items-center justify-center"
              >
                <p className="text-muted-foreground">Loading lyrics...</p>
              </motion.div>
            ) : lyrics ? (
              <motion.div
                key="lyrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-h-60 overflow-y-auto scrollbar-hidden border border-border rounded-xl p-4 bg-secondary/30 backdrop-blur-sm"
              >
                <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                  {lyrics}
                </pre>
              </motion.div>
            ) : (
              <motion.div
                key="no-lyrics"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-40 flex flex-col items-center justify-center text-center text-muted-foreground p-4 border border-border rounded-xl bg-secondary/30 backdrop-blur-sm"
              >
                <p className="mb-2">Lyrics not available for this song.</p>
                {queue.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2 text-foreground">Next in queue:</h3>
                    <div className="flex items-center">
                      <img 
                        src={queue[0].albumArt || "https://picsum.photos/seed/music/200"} 
                        alt={queue[0].title}
                        className="h-8 w-8 rounded-md object-cover mr-2"
                      />
                      <div className="text-left">
                        <p className="text-xs truncate max-w-[150px]">{queue[0].title}</p>
                        <p className="text-xs text-muted-foreground truncate max-w-[150px]">{queue[0].artist}</p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
