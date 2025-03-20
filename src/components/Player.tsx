
import { useState, useEffect, useRef } from "react";
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
  ListMusic,
  X
} from "lucide-react";
import { MusicCard } from "./MusicCard";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

export function Player() {
  const { 
    currentSong, 
    isPlaying, 
    togglePlayPause,
    playNext,
    playPrevious,
    volume,
    setVolume,
    progress,
    setProgress,
    queue,
    removeFromQueue
  } = useAppContext();
  
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Handle play/pause
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);
  
  // Handle volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Handle time update
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      
      setCurrentTime(current);
      setProgress((current / duration) * 100);
    }
  };
  
  // Handle song end
  const handleSongEnd = () => {
    playNext();
  };
  
  // Handle duration change
  const handleDurationChange = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Handle seek
  const handleSeek = (value: number[]) => {
    const seekTime = (value[0] / 100) * duration;
    
    setProgress(value[0]);
    setCurrentTime(seekTime);
    
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };
  
  // If there's no current song, don't render the player
  if (!currentSong) {
    return null;
  }
  
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 py-2">
      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleSongEnd}
        onDurationChange={handleDurationChange}
        onLoadedMetadata={handleDurationChange}
        style={{ display: "none" }}
      />
      
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="glass border border-border/50 rounded-xl shadow-lg overflow-hidden backdrop-blur-lg"
        >
          {/* Progress Bar (Top) */}
          <div className="h-1 w-full bg-secondary relative">
            <div 
              className="absolute inset-y-0 left-0 bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="grid grid-cols-12 gap-4 items-center p-3">
            {/* Song Info */}
            <div className="col-span-12 md:col-span-3 flex items-center gap-3">
              <div className="h-12 w-12 rounded-md overflow-hidden bg-muted flex-shrink-0">
                <img 
                  src={currentSong.albumArt || "https://picsum.photos/seed/music/200"} 
                  alt={currentSong.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <h4 className="font-medium truncate">{currentSong.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="col-span-12 md:col-span-6">
              <div className="flex flex-col items-center gap-2">
                {/* Main Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={playPrevious}
                    className="h-10 w-10 rounded-full hover:bg-secondary"
                  >
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  
                  <Button 
                    size="icon" 
                    onClick={togglePlayPause}
                    className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5 fill-white" />
                    ) : (
                      <Play className="h-5 w-5 fill-white ml-1" />
                    )}
                  </Button>
                  
                  <Button 
                    size="icon" 
                    variant="ghost" 
                    onClick={playNext}
                    className="h-10 w-10 rounded-full hover:bg-secondary"
                  >
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Time and Progress */}
                <div className="w-full flex items-center gap-2 px-2">
                  <span className="text-xs text-muted-foreground min-w-12 text-right">
                    {formatTime(currentTime)}
                  </span>
                  
                  <Slider
                    className="flex-1"
                    value={[progress]}
                    max={100}
                    step={0.1}
                    onValueChange={handleSeek}
                  />
                  
                  <span className="text-xs text-muted-foreground min-w-12">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Volume and Queue */}
            <div className="col-span-12 md:col-span-3 flex items-center justify-end gap-4">
              <div className="hidden md:flex items-center gap-2 w-32">
                <Button 
                  size="icon" 
                  variant="ghost"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
                >
                  {volume === 0 ? (
                    <VolumeX className="h-4 w-4" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </Button>
                
                <Slider
                  className="flex-1"
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                />
              </div>
              
              <Sheet open={isQueueOpen} onOpenChange={setIsQueueOpen}>
                <SheetTrigger asChild>
                  <Button 
                    size="icon" 
                    variant="outline"
                    className="h-9 w-9 rounded-full relative"
                  >
                    <ListMusic className="h-4 w-4" />
                    {queue.length > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {queue.length}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-md flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Queue</h3>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8 rounded-full"
                      onClick={() => setIsQueueOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence initial={false}>
                      {queue.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center h-full text-center p-4"
                        >
                          <ListMusic className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                          <h4 className="font-medium text-muted-foreground">Your queue is empty</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Add songs to your queue to listen to them next
                          </p>
                        </motion.div>
                      ) : (
                        <div className="space-y-1 px-1">
                          {queue.map((song, index) => (
                            <motion.div
                              key={`${song.id}-${index}`}
                              initial={{ opacity: 0, x: 50 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -50 }}
                              transition={{ duration: 0.2 }}
                              layout
                            >
                              <MusicCard 
                                song={song} 
                                variant="list" 
                                showAddToQueue={false} 
                              />
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
