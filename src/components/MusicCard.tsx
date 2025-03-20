
import { Song, useAppContext } from "@/contexts/AppContext";
import { cn } from "@/lib/utils";
import { Heart, ListPlus, Play } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";

interface MusicCardProps {
  song: Song;
  variant?: "grid" | "list";
  showAddToQueue?: boolean;
}

export function MusicCard({ song, variant = "grid", showAddToQueue = true }: MusicCardProps) {
  const { setCurrentSong, addToQueue, currentSong, isPlaying } = useAppContext();
  
  const isCurrentSong = currentSong?.id === song.id;

  const playSong = () => {
    setCurrentSong(song);
  };

  const handleAddToQueue = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToQueue(song);
  };

  if (variant === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center gap-4 p-3 rounded-xl transition-all duration-300",
          "hover:bg-secondary/80 cursor-pointer",
          isCurrentSong && "bg-secondary/80"
        )}
        onClick={playSong}
      >
        <div className="relative w-12 h-12 rounded-md overflow-hidden">
          <img 
            src={song.albumArt || "https://picsum.photos/seed/music/200"} 
            alt={song.title}
            className="w-full h-full object-cover"
          />
          {isCurrentSong && isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <div className="wave-container flex items-end h-6">
                <span className="bg-white animate-wave-1"></span>
                <span className="bg-white animate-wave-2"></span>
                <span className="bg-white animate-wave-3"></span>
                <span className="bg-white animate-wave-4"></span>
                <span className="bg-white animate-wave-5"></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{song.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            {formatTime(song.duration)}
          </span>
          
          {showAddToQueue && !isCurrentSong && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full"
              onClick={handleAddToQueue}
            >
              <ListPlus className="h-4 w-4" />
              <span className="sr-only">Add to queue</span>
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-xl overflow-hidden"
    >
      <div 
        className="relative aspect-square bg-muted overflow-hidden rounded-xl cursor-pointer"
        onClick={playSong}
      >
        {/* Album Art */}
        <img 
          src={song.albumArt || "https://picsum.photos/seed/music/300"} 
          alt={song.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button 
            size="icon" 
            className="h-14 w-14 rounded-full bg-primary/90 border-4 border-white/20 backdrop-blur-sm hover:scale-105 transition-all shadow-xl"
          >
            <Play className="h-6 w-6 fill-white" />
          </Button>
        </div>
        
        {/* Currently Playing Indicator */}
        {isCurrentSong && (
          <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-primary animate-pulse-subtle" />
        )}
      </div>
      
      <div className="mt-3 px-1">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate">{song.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
          </div>
          
          {showAddToQueue && (
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 rounded-full -mt-1"
              onClick={handleAddToQueue}
            >
              <ListPlus className="h-4 w-4" />
              <span className="sr-only">Add to queue</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
