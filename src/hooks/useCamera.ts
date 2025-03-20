
import { useState, useEffect, useRef } from "react";

interface UseCameraOptions {
  onFrame?: (video: HTMLVideoElement) => void;
  frameRate?: number;
}

export function useCamera(options: UseCameraOptions = {}) {
  const { onFrame, frameRate = 500 } = options;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<"granted" | "denied" | "prompt">("prompt");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const frameLoopRef = useRef<number | null>(null);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      
      setStream(mediaStream);
      setPermission("granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      // Start frame processing if callback provided
      if (onFrame && videoRef.current) {
        startFrameProcessing();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown camera error"));
      setPermission("denied");
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (frameLoopRef.current) {
      cancelAnimationFrame(frameLoopRef.current);
      frameLoopRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const startFrameProcessing = () => {
    if (!onFrame || !videoRef.current) return;
    
    let lastProcessTime = 0;
    
    const processFrame = (timestamp: number) => {
      if (timestamp - lastProcessTime > frameRate && videoRef.current) {
        onFrame(videoRef.current);
        lastProcessTime = timestamp;
      }
      
      frameLoopRef.current = requestAnimationFrame(processFrame);
    };
    
    frameLoopRef.current = requestAnimationFrame(processFrame);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return {
    videoRef,
    stream,
    isLoading,
    error,
    permission,
    startCamera,
    stopCamera
  };
}
