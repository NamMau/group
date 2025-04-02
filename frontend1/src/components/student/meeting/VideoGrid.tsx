"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketContext";
import VideoCard from "./VideoCard";
import { FaSpinner } from "react-icons/fa";

interface Participant {
  id: string;
  name: string;
  stream?: MediaStream;
  isMuted: boolean;
  isVideoOff: boolean;
  isSpeaking: boolean;
  isScreenSharing: boolean;
}

interface VideoGridProps {
  meetingId: string;
  userId: string;
  userName: string;
}

const VideoGrid: React.FC<VideoGridProps> = ({ meetingId, userId, userName }) => {
  const socket = useSocket();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Khởi tạo local stream
  useEffect(() => {
    const initializeLocalStream = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);

        // Thêm local participant vào danh sách
        setParticipants(prev => [
          {
            id: userId,
            name: userName,
            stream,
            isMuted: false,
            isVideoOff: false,
            isSpeaking: false,
            isScreenSharing: false,
          },
          ...prev.filter(p => p.id !== userId)
        ]);
      } catch (error) {
        setError("Failed to access camera and microphone. Please check your permissions.");
        console.error("Error accessing media devices:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocalStream();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => {
          if (track.readyState === 'live') {
            track.stop();
          }
        });
      }
    };
  }, [userId, userName]);

  // Xử lý WebRTC và socket events
  useEffect(() => {
    if (!socket || !localStream) return;

    // Lắng nghe khi có người tham gia mới
    socket.on('participant-joined', (participant: Participant) => {
      setParticipants(prev => [...prev, participant]);
    });

    // Lắng nghe khi có người rời đi
    socket.on('participant-left', (participantId: string) => {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    });

    // Lắng nghe khi có người thay đổi trạng thái
    socket.on('participant-updated', (updatedParticipant: Participant) => {
      setParticipants(prev =>
        prev.map(p =>
          p.id === updatedParticipant.id ? updatedParticipant : p
        )
      );
    });

    // Lắng nghe khi có người bắt đầu/ngừng nói
    socket.on('participant-speaking', (data: { id: string; isSpeaking: boolean }) => {
      setParticipants(prev =>
        prev.map(p =>
          p.id === data.id ? { ...p, isSpeaking: data.isSpeaking } : p
        )
      );
    });

    // Lắng nghe khi có người bắt đầu/ngừng chia sẻ màn hình
    socket.on('participant-screen-sharing', (data: { id: string; isScreenSharing: boolean }) => {
      setParticipants(prev =>
        prev.map(p =>
          p.id === data.id ? { ...p, isScreenSharing: data.isScreenSharing } : p
        )
      );
    });

    // Thông báo tham gia meeting
    socket.emit('join-meeting', {
      meetingId,
      userId,
      userName,
    });

    return () => {
      socket.off('participant-joined');
      socket.off('participant-left');
      socket.off('participant-updated');
      socket.off('participant-speaking');
      socket.off('participant-screen-sharing');
      socket.emit('leave-meeting', { meetingId, userId });
    };
  }, [socket, meetingId, userId, userName, localStream]);

  // Cập nhật layout dựa trên số lượng participants
  const getGridLayout = () => {
    const count = participants.length;
    if (count <= 1) return 'grid-cols-1';
    if (count <= 2) return 'grid-cols-2';
    if (count <= 3) return 'grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className={`grid ${getGridLayout()} gap-4 p-4 max-w-7xl mx-auto`}>
      {participants.map((participant) => (
        <VideoCard
          key={participant.id}
          name={participant.name}
          stream={participant.stream}
          isLocal={participant.id === userId}
          isMuted={participant.isMuted}
          isVideoOff={participant.isVideoOff}
          isSpeaking={participant.isSpeaking}
          isScreenSharing={participant.isScreenSharing}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
