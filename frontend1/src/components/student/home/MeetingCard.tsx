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

  const formatTime = (time: Date): string => { // Nhận đối tượng Date
    try {
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

  const formatDate = (date: Date): string => { // Nhận đối tượng Date
    try {
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
        <div key={meeting._id} className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800">{meeting.notes}</h3>
              {meeting.course && <p className="text-sm text-gray-600">Class: {meeting.course.name}</p>}
              {meeting.tutor && <p className="text-sm text-gray-600">Tutor: {meeting.tutor.fullName}</p>}
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              meeting.status === 'completed' ? 'bg-green-100 text-green-800' :
              meeting.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
              meeting.status === 'cancelled' ? 'bg-gray-100 text-gray-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {meeting.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <p>Time: {formatTime(meeting.time)}</p> {/* Gọi với đối tượng Date */}
            <p>Date: {formatDate(meeting.date)}</p> {/* Gọi với đối tượng Date */}
          </div>

          <button
            onClick={() => handleJoinMeeting(meeting.meetingLink)}
            className="mt-3 flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
          >
            <FaVideo />
            <span>Join now</span>
          </button>
        </div>
      ))}
    </div>
  );
};

export default MeetingCard;