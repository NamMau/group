"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface MeetingItemProps {
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
  onJoinMeeting: (meetingId: string) => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({
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
  onJoinMeeting,
}) => {
  const router = useRouter();

  const handleJoinMeeting = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("User is not logged in.");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/meetings/${meetingId}/join-meeting`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        const meetingLink = response.data.meetingLink || `/student/meeting/${meetingId}`;
        router.push(meetingLink);
      }
    } catch (error) {
      console.error("Failed to join meeting:", 
        error && typeof error === 'object' && 'response' in error 
          ? (error.response as any)?.data?.message || 'Unknown error occurred'
          : error instanceof Error 
            ? error.message 
            : 'An unexpected error occurred'
      );
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{courseName}</h3>
          <p className="text-sm text-gray-600">Tutor: {tutorName}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Date: {formatDate(date)}</p>
            <p>Time: {formatTime(startTime)} - {formatTime(endTime)}</p>
            <p>Duration: {duration} minutes</p>
          </div>
          {notes && (
            <p className="mt-2 text-sm text-gray-600 italic">"{notes}"</p>
          )}
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-sm font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
          {status === 'ongoing' && (
            <button
              onClick={handleJoinMeeting}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Join Meeting
            </button>
          )}
          {meetingLink && (
            <button
              onClick={() => navigator.clipboard.writeText(meetingLink)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Copy Link
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingItem;
