"use client";
import { useState, useEffect } from "react";
import { FaVideo } from "react-icons/fa";
import { meetingService, Meeting } from "../../../services/meetingService"; // Import meetingService

const MeetingCard = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMeetings = await meetingService.getAllMeetings(); // Use meetingService
      setMeetings(fetchedMeetings);
    } catch (err) {
      setError("Failed to load meetings");
      console.error("Error fetching meetings:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string | Date): string => {
    try {
      // If time is a string in HH:mm format, create a Date object
      if (typeof time === 'string') {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        time = date;
      }

      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "Invalid Time";
    }
  };

  const formatDate = (date: string | Date): string => {
    try {
      // If date is a string, convert it to Date object
      if (typeof date === 'string') {
        date = new Date(date);
      }

      return date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  };

  const handleJoinMeeting = (meetingLink: string | undefined) => {
    if (meetingLink) {
      window.open(meetingLink, '_blank');
    } else {
      console.error("Meeting link is undefined.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-4">
        <p className="text-sm font-semibold">{error}</p>
        <button
          onClick={fetchMeetings}
          className="mt-2 px-3 py-1 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500 text-sm">No upcoming meetings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div
          key={meeting._id}
          className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">
              {formatDate(meeting.date)}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs ${
              meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
              meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <FaVideo className="mr-2" />
            <span>{formatTime(meeting.time)}</span>
            <span className="mx-2">•</span>
            <span>{meeting.duration} minutes</span>
          </div>
          {meeting.meetingLink && (
            <button
              onClick={() => handleJoinMeeting(meeting.meetingLink)}
              className="w-full mt-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm"
            >
              Join Meeting
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MeetingCard;