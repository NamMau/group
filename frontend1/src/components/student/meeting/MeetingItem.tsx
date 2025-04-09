"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { meetingService, Meeting } from "@/services/meetingService";

interface MeetingItemProps extends Meeting {
  onJoinMeeting: (meetingId: string) => void;
}

const MeetingItem: React.FC<MeetingItemProps> = ({
  _id,
  course,
  tutor,
  date,
  time,
  duration,
  status,
  meetingLink,
  notes,
  onJoinMeeting,
}) => {
  const router = useRouter();
  const defaultMeetingLink = "https://meet.google.com/utd-bive-rmy";

  const handleJoinMeetingClick = async () => {
    try {
      await meetingService.joinMeeting(_id);
      const linkToJoin = meetingLink || defaultMeetingLink;
      router.push(linkToJoin);
    } catch (error) {
      console.error("Failed to join meeting:", error);
      // Optionally display an error message to the user
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-400';
      case 'completed':
        return 'text-gray-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (date: Date | null) => {
    try {
      return date ? date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) : 'N/A';
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid Date';
    }
  };

  const formatTime = (time: Date | null) => {
    try {
      if (!time) {
        return 'N/A';
      }
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time:", error);
      return 'Invalid Time';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{course?.name || 'Course info unavailable'}</h3>
          <p className="text-sm text-gray-600">Tutor: {tutor?.fullName || 'Tutor info unavailable'}</p>
          <div className="mt-2 text-sm text-gray-500">
            <p>Date: {formatDate(date)}</p>
            <p>Time: {formatTime(time)}</p>
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
          <button
            onClick={handleJoinMeetingClick} // Sử dụng hàm handleJoinMeetingClick
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Meeting
          </button>
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