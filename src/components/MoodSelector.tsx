
import { useState } from "react";
import { useAppContext, Mood } from "../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { detectMoodFromFace, getMoodColor, getMoodEmoji } from "@/services/moodDetection";
import { toast } from "sonner";

const moods: Mood[] = [
  "happy",
  "sad",
  "relaxed",
  "energetic",
  "romantic",
  "angry",
  "chill",
  "focused",
  "excited",
  "sleepy",
  "motivated"
];

export function MoodSelector() {
  const { selectedMood, setSelectedMood } = useAppContext();
  const [isDetecting, setIsDetecting] = useState(false);

  const handleMoodSelection = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleAutomaticDetection = async () => {
    setIsDetecting(true);
    try {
      const detectedMood = await detectMoodFromFace();
      if (detectedMood) {
        setSelectedMood(detectedMood);
        toast.success(`We detected you're feeling ${detectedMood}!`);
      } else {
        toast.error("Couldn't detect your mood. Please try again or select manually.");
      }
    } catch (error) {
      toast.error("Error accessing camera. Please allow camera access and try again.");
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-medium">How are you feeling today?</h2>
        <Button
          onClick={handleAutomaticDetection}
          variant="outline"
          className="flex items-center gap-2 bg-secondary/80 backdrop-blur-sm"
          disabled={isDetecting}
        >
          {isDetecting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
          <span>{isDetecting ? "Detecting..." : "Detect My Mood"}</span>
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-8">
        {moods.map((mood) => (
          <motion.div
            key={mood}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => handleMoodSelection(mood)}
              className={`w-full aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-300 border-2 ${
                selectedMood === mood
                  ? "border-primary shadow-lg"
                  : "border-transparent hover:border-primary/30"
              } ${getMoodColor(mood)}`}
            >
              <span className="text-3xl mb-2">{getMoodEmoji(mood)}</span>
              <span className="capitalize text-white font-medium">{mood}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
