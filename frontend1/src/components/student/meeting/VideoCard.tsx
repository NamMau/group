"use client";
import React, { useEffect, useRef, useState } from "react";
import { FaMicrophoneSlash, FaVideoSlash, FaSpinner } from "react-icons/fa";

interface VideoCardProps {
  name: string;
  stream?: MediaStream;
  isLocal?: boolean;
  isMuted?: boolean;
  isVideoOff?: boolean;
  isSpeaking?: boolean;
  isScreenSharing?: boolean;
}

const VideoCard: React.FC<VideoCardProps> = ({
  name,
  stream,
  isLocal = false,
  isMuted = false,
  isVideoOff = false,
  isSpeaking = false,
  isScreenSharing = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setIsLoading(false);
      setError(null);
    };

    const handleError = (e: Event) => {
      setIsLoading(false);
      setError("Failed to load video stream");
      console.error("Video error:", e);
    };

    if (stream) {
      video.srcObject = stream;
      video.addEventListener('loadedmetadata', handleLoadedMetadata);
      video.addEventListener('error', handleError);
    } else {
      setIsLoading(false);
    }

    return () => {
      if (video.srcObject) {
        const tracks = (video.srcObject as MediaStream).getTracks();
        tracks.forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('error', handleError);
    };
  }, [stream]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative w-60 h-36 bg-gray-700 rounded-lg overflow-hidden ${
      isSpeaking ? 'ring-2 ring-green-500' : ''
    }`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <FaSpinner className="animate-spin text-white text-2xl" />
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {!isVideoOff ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal || isMuted}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800">
          <div className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center ${
            isSpeaking ? 'bg-green-600' : 'bg-gray-600'
          }`}>
            <span className="text-2xl text-white font-semibold">
              {getInitials(name)}
            </span>
          </div>
          <p className="text-sm text-gray-300">{name}</p>
        </div>
      )}
      
      {/* Status indicators */}
      <div className="absolute bottom-2 left-2 flex gap-1">
        {isMuted && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <FaMicrophoneSlash />
            <span>Muted</span>
          </div>
        )}
        {isVideoOff && (
          <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <FaVideoSlash />
            <span>Camera Off</span>
          </div>
        )}
        {isScreenSharing && (
          <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            Screen Sharing
          </div>
        )}
      </div>

      {/* Name overlay */}
      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full">
        {isLocal ? `${name} (You)` : name}
      </div>

      {/* Speaking indicator */}
      {isSpeaking && !isVideoOff && (
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      )}
    </div>
  );
};

export default VideoCard;
  