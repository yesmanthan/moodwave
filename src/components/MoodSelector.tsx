
import { useState, useRef } from "react";
import { useAppContext, Mood } from "../contexts/AppContext";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Loader2, X } from "lucide-react";
import { detectMoodFromFace, getMoodColor, getMoodEmoji, loadFaceDetectionModel } from "@/services/moodDetection";
import { toast } from "sonner";
import { useCamera } from "@/hooks/useCamera";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

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
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const detectionIntervalRef = useRef<number | null>(null);
  
  // Use our camera hook
  const { 
    videoRef,
    startCamera,
    stopCamera,
    isLoading: isCameraLoading,
    error: cameraError,
    permission
  } = useCamera();

  const handleMoodSelection = (mood: Mood) => {
    setSelectedMood(mood);
  };

  const handleCloseCameraModal = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    stopCamera();
    setIsCameraOpen(false);
    setIsDetecting(false);
  };

  const handleAutomaticDetection = async () => {
    setIsCameraOpen(true);
    
    // Start camera when opening modal
    try {
      await startCamera();
      
      // Pre-load the face detection model if not already loaded
      if (!modelLoaded) {
        setIsDetecting(true);
        await loadFaceDetectionModel();
        setModelLoaded(true);
        setIsDetecting(false);
      }
    } catch (error) {
      console.error("Error starting camera:", error);
      toast.error("Failed to access camera. Please check permissions and try again.");
      setIsCameraOpen(false);
    }
  };
  
  const startMoodDetection = async () => {
    if (!videoRef.current) return;
    
    setIsDetecting(true);
    
    try {
      const detectedMood = await detectMoodFromFace(videoRef.current);
      
      if (detectedMood) {
        setSelectedMood(detectedMood);
        toast.success(`We detected you're feeling ${detectedMood}!`);
        handleCloseCameraModal();
      } else {
        toast.error("Couldn't detect your mood. Please try again or select manually.");
        setIsDetecting(false);
      }
    } catch (error) {
      console.error("Error detecting mood:", error);
      toast.error("Error detecting mood. Please try again.");
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
        >
          <Camera className="h-4 w-4" />
          <span>Detect My Mood</span>
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

      {/* Camera Modal */}
      <Sheet open={isCameraOpen} onOpenChange={(open) => {
        if (!open) handleCloseCameraModal();
        setIsCameraOpen(open);
      }}>
        <SheetContent side="bottom" className="h-[90vh] sm:h-[600px] flex flex-col p-0">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-medium text-lg">AI Mood Detection</h3>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleCloseCameraModal}
              className="rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
            <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden bg-black">
              {cameraError ? (
                <div className="absolute inset-0 flex items-center justify-center text-center p-6 bg-background/90">
                  <div>
                    <p className="text-destructive text-sm mb-2">Camera access denied</p>
                    <p className="text-muted-foreground text-xs">
                      Please allow camera access to use the mood detection feature
                    </p>
                  </div>
                </div>
              ) : (
                <video 
                  ref={videoRef} 
                  className="w-full h-full object-cover"
                  autoPlay
                  playsInline
                  muted
                />
              )}
              
              {isCameraLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}
            </div>
            
            <AnimatePresence>
              {!isDetecting && !cameraError && permission === "granted" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <Button
                    onClick={startMoodDetection}
                    className="px-8 py-6 rounded-xl text-lg font-medium"
                  >
                    <span>Detect My Mood Now</span>
                  </Button>
                </motion.div>
              )}
              
              {isDetecting && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-3"
                >
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground">Analyzing your expression...</p>
                </motion.div>
              )}
              
              {cameraError && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCameraOpen(false);
                  }}
                >
                  Continue with Manual Selection
                </Button>
              )}
            </AnimatePresence>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
