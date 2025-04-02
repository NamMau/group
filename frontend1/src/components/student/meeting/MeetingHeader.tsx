"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "../../../context/SocketContext";
import { useRouter } from "next/navigation";
import { FaSpinner } from "react-icons/fa";

interface MeetingHeaderProps {
  meetingId: string;
  courseId: string;
  courseName: string;
  tutorId: string;
  tutorName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  onLeaveMeeting: () => void;
}

const MeetingHeader: React.FC<MeetingHeaderProps> = ({
  meetingId,
  courseId,
  courseName,
  tutorId,
  tutorName,
  date,
  startTime,
  endTime,
  duration,
  status,
  meetingLink,
  notes,
  onLeaveMeeting,
}) => {
  const socket = useSocket();
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Tính thời gian còn lại
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Meeting ended");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m left`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [endTime]);

  // Lắng nghe số lượng người tham gia
  useEffect(() => {
    if (!socket) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    socket.on('participant-count-update', (count: number) => {
      setParticipantCount(count);
    });

    // Lắng nghe sự kiện meeting đã kết thúc
    socket.on('meeting-ended', () => {
      handleLeave();
    });

    return () => {
      socket.off('participant-count-update');
      socket.off('meeting-ended');
    };
  }, [socket]);

  const handleLeave = async () => {
    if (!socket) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    try {
      setIsLeaving(true);
      setError(null);

      // Emit sự kiện rời meeting
      socket.emit('leave-meeting', { meetingId });

      // Chờ một chút để đảm bảo server xử lý xong
      await new Promise(resolve => setTimeout(resolve, 500));

      // Gọi callback và chuyển hướng
      onLeaveMeeting();
      router.push('/student/meeting');
    } catch (err) {
      setError("Failed to leave meeting. Please try again.");
      setIsLeaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400';
      case 'ongoing':
        return 'text-green-400';
      case 'completed':
        return 'text-gray-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <header className="p-4 bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{courseName}</h1>
          <div className="text-sm text-gray-400 mt-1">
            <span>Tutor: {tutorName}</span>
            <span className="mx-2">•</span>
            <span>{participantCount} participants</span>
            <span className="mx-2">•</span>
            <span className={getStatusColor(status)}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <div className="text-gray-400">Time</div>
            <div className="font-medium">{timeLeft}</div>
          </div>

          {error && (
            <div className="text-sm text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 ${
              isLeaving ? 'opacity-50 cursor-wait' : ''
            }`}
          >
            {isLeaving ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Leaving...</span>
              </>
            ) : (
              'Leave Meeting'
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default MeetingHeader;
  