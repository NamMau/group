"use client";
import React, { useState, useEffect } from "react";
import { FaMicrophone, FaVideo, FaDesktop, FaRecordVinyl, FaPhone, FaSpinner } from "react-icons/fa";
import { useSocket } from "../../../context/SocketContext";
import { useRouter } from "next/navigation";

interface MeetingControlsProps {
  meetingId: string;
  onLeaveMeeting: () => void;
}

interface ControlsState {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
}

interface ControlsUpdateData {
  meetingId: string;
  controls: ControlsState;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({ meetingId, onLeaveMeeting }) => {
  const socket = useSocket();
  const router = useRouter();
  const [controls, setControls] = useState<ControlsState>({
    isMuted: false,
    isVideoOff: false,
    isScreenSharing: false,
    isRecording: false
  });
  const [isLoading, setIsLoading] = useState<keyof ControlsState | null>(null);
  const [isLeaving, setIsLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    // Lắng nghe sự kiện từ server
    socket.on('meeting-controls-update', (data: ControlsUpdateData) => {
      if (data.meetingId === meetingId) {
        setControls(prev => ({
          ...prev,
          ...data.controls
        }));
        setIsLoading(null);
      }
    });

    // Lắng nghe lỗi từ server
    socket.on('meeting-controls-error', (error: string) => {
      setError(error);
      setIsLoading(null);
    });

    // Lắng nghe sự kiện meeting đã kết thúc
    socket.on('meeting-ended', () => {
      handleLeaveMeeting();
    });

    return () => {
      socket.off('meeting-controls-update');
      socket.off('meeting-controls-error');
      socket.off('meeting-ended');
    };
  }, [socket, meetingId]);

  const handleControl = async (controlType: keyof ControlsState) => {
    if (!socket) {
      setError("Connection lost. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(controlType);
      setError(null);

      const newControls = {
        ...controls,
        [controlType]: !controls[controlType]
      };

      // Emit sự kiện để cập nhật trạng thái
      socket.emit('update-meeting-controls', {
        meetingId,
        controls: newControls
      });

      setControls(newControls);
    } catch (err) {
      setError("Failed to update controls. Please try again.");
      setIsLoading(null);
    }
  };

  const handleLeaveMeeting = async () => {
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

  const renderControlButton = (
    controlType: keyof ControlsState,
    icon: React.ReactNode,
    title: string,
    activeColor: string = 'bg-red-600'
  ) => {
    const isActive = controls[controlType];
    const isButtonLoading = isLoading === controlType;

    return (
      <button 
        className={`p-2 rounded-full transition-colors duration-200 relative ${
          isActive ? activeColor : 'bg-gray-600 hover:bg-gray-700'
        } ${isButtonLoading ? 'cursor-wait' : ''}`}
        onClick={() => handleControl(controlType)}
        title={title}
        disabled={isButtonLoading || isLeaving}
      >
        {isButtonLoading ? (
          <FaSpinner className="animate-spin text-white" />
        ) : (
          icon
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex justify-center gap-4 p-4 bg-gray-800 rounded-lg">
        {renderControlButton(
          'isMuted',
          <FaMicrophone className={controls.isMuted ? 'text-white' : 'text-gray-300'} />,
          controls.isMuted ? "Unmute" : "Mute"
        )}

        {renderControlButton(
          'isVideoOff',
          <FaVideo className={controls.isVideoOff ? 'text-white' : 'text-gray-300'} />,
          controls.isVideoOff ? "Turn on video" : "Turn off video"
        )}

        {renderControlButton(
          'isScreenSharing',
          <FaDesktop className={controls.isScreenSharing ? 'text-white' : 'text-gray-300'} />,
          controls.isScreenSharing ? "Stop sharing" : "Share screen",
          'bg-blue-600'
        )}

        {renderControlButton(
          'isRecording',
          <FaRecordVinyl className={controls.isRecording ? 'text-white' : 'text-gray-300'} />,
          controls.isRecording ? "Stop recording" : "Start recording"
        )}

        <button 
          className={`p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors duration-200 flex items-center gap-2 ${
            isLeaving ? 'opacity-50 cursor-wait' : ''
          }`}
          onClick={handleLeaveMeeting}
          title="Leave meeting"
          disabled={isLeaving}
        >
          {isLeaving ? (
            <FaSpinner className="animate-spin text-white" />
          ) : (
            <FaPhone className="text-white" />
          )}
          <span className="text-white text-sm">Leave</span>
        </button>
      </div>
    </div>
  );
};

export default MeetingControls;
