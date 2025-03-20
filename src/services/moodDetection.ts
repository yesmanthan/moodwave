import { Mood } from "../contexts/AppContext";
import * as tf from '@tensorflow/tfjs';
import * as faceLandmarksDetection from '@tensorflow-models/face-landmarks-detection';

let model: faceLandmarksDetection.FaceLandmarksDetector | null = null;

export async function loadFaceDetectionModel() {
  if (model) return model;
  
  try {
    // Make sure TensorFlow is ready
    await tf.ready();
    
    // Load the MediaPipe Facemesh model
    model = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1 }
    );
    
    return model;
  } catch (error) {
    console.error("Failed to load face detection model:", error);
    throw error;
  }
}

// Maps facial expressions to moods based on facial landmarks analysis
function mapExpressionToMood(
  eyeOpenness: number, 
  mouthOpenness: number, 
  eyebrowRaise: number
): Mood {
  // Simple heuristics for mood detection based on facial features
  if (eyebrowRaise > 15 && mouthOpenness > 20) {
    return "excited"; // Raised eyebrows and open mouth
  } else if (eyebrowRaise > 10 && mouthOpenness < 5) {
    return "surprised"; // Raised eyebrows, closed mouth
  } else if (eyeOpenness < 5) {
    return "sleepy"; // Eyes nearly closed
  } else if (mouthOpenness > 15 && eyebrowRaise < 5) {
    return "happy"; // Open mouth, neutral eyebrows
  } else if (eyebrowRaise < 0 && mouthOpenness < 5) {
    return "sad"; // Lowered eyebrows, closed mouth
  } else if (eyebrowRaise < 0 && mouthOpenness > 10) {
    return "angry"; // Lowered eyebrows, open mouth
  } else if (eyeOpenness > 8 && mouthOpenness < 8 && eyebrowRaise > 5) {
    return "focused"; // Wide eyes, closed mouth, slightly raised eyebrows
  } else if (eyeOpenness > 5 && mouthOpenness < 5 && eyebrowRaise < 5) {
    return "relaxed"; // Neutral expression
  } else if (eyeOpenness > 8 && mouthOpenness < 5 && eyebrowRaise > 0) {
    return "motivated"; // Wide eyes, determined look
  } else {
    return "chill"; // Default if no clear pattern
  }
}

// This function analyzes facial landmarks to estimate mood
async function analyzeFacialExpression(video: HTMLVideoElement): Promise<Mood | null> {
  if (!model) {
    await loadFaceDetectionModel();
  }
  
  if (!model) return null;
  
  try {
    // Get face predictions
    const predictions = await model.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: false,
      predictIrises: true
    });
    
    if (predictions.length === 0) {
      console.log("No face detected");
      return null;
    }
    
    const face = predictions[0];
    const landmarks = face.scaledMesh;
    
    // Extract key facial points (simplified for this example)
    // These indices are approximate for MediaPipe's facemesh
    const leftEyeTop = landmarks[159];
    const leftEyeBottom = landmarks[145];
    const rightEyeTop = landmarks[386];
    const rightEyeBottom = landmarks[374];
    const leftEyebrow = landmarks[107];
    const rightEyebrow = landmarks[336];
    const mouthTop = landmarks[13];
    const mouthBottom = landmarks[14];
    const nose = landmarks[1];
    
    // Calculate facial metrics
    const leftEyeOpenness = Math.sqrt(
      Math.pow(leftEyeTop[1] - leftEyeBottom[1], 2)
    );
    const rightEyeOpenness = Math.sqrt(
      Math.pow(rightEyeTop[1] - rightEyeBottom[1], 2)
    );
    const eyeOpenness = (leftEyeOpenness + rightEyeOpenness) / 2;
    
    const mouthOpenness = Math.sqrt(
      Math.pow(mouthTop[1] - mouthBottom[1], 2)
    );
    
    const eyebrowBaseline = (nose[1] - 20); // Approximate baseline
    const leftEyebrowRaise = eyebrowBaseline - leftEyebrow[1];
    const rightEyebrowRaise = eyebrowBaseline - rightEyebrow[1];
    const eyebrowRaise = (leftEyebrowRaise + rightEyebrowRaise) / 2;
    
    // Map facial features to mood
    return mapExpressionToMood(eyeOpenness, mouthOpenness, eyebrowRaise);
  } catch (error) {
    console.error("Error analyzing facial expression:", error);
    return null;
  }
}

// Main function to detect mood from face
export async function detectMoodFromFace(videoElement: HTMLVideoElement): Promise<Mood | null> {
  try {
    // Make sure the model is loaded
    if (!model) {
      await loadFaceDetectionModel();
    }
    
    // Analyze facial expression from video
    return await analyzeFacialExpression(videoElement);
  } catch (error) {
    console.error("Error detecting mood:", error);
    return null;
  }
}

export function getMoodEmoji(mood: Mood): string {
  const moodEmojis: Record<Mood, string> = {
    happy: "😊",
    sad: "😢",
    relaxed: "😌",
    energetic: "⚡",
    romantic: "💖",
    angry: "😠",
    chill: "😎",
    focused: "🧠",
    excited: "🤩",
    sleepy: "😴",
    motivated: "💪"
  };
  
  return moodEmojis[mood] || "🎵";
}

export function getMoodColor(mood: Mood): string {
  const moodColors: Record<Mood, string> = {
    happy: "mood-gradient-happy",
    sad: "mood-gradient-sad",
    relaxed: "mood-gradient-relaxed",
    energetic: "mood-gradient-energetic",
    romantic: "mood-gradient-romantic",
    angry: "mood-gradient-angry",
    chill: "mood-gradient-chill",
    focused: "mood-gradient-focused",
    excited: "mood-gradient-energetic",
    sleepy: "mood-gradient-relaxed",
    motivated: "mood-gradient-focused"
  };
  
  return moodColors[mood] || "bg-primary";
}

export function getMoodDescription(mood: Mood): string {
  const descriptions: Record<Mood, string> = {
    happy: "Uplifting tunes to keep your spirits high",
    sad: "Melancholic melodies for those reflective moments",
    relaxed: "Gentle, calming sounds to help you unwind",
    energetic: "High-tempo beats to boost your energy",
    romantic: "Love-filled tunes for heartfelt moments",
    angry: "Intense tracks to channel your emotions",
    chill: "Laid-back vibes for easy listening",
    focused: "Distraction-free audio to help you concentrate",
    excited: "Thrilling tracks that capture your enthusiasm",
    sleepy: "Soothing sounds to help you drift off",
    motivated: "Empowering music to push you forward"
  };
  
  return descriptions[mood] || "Music for every mood";
}
