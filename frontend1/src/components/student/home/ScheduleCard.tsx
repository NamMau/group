"use client";
import { useState, useEffect } from "react";
import { FaCalendarAlt, FaUserGraduate, FaClock, FaVideo } from "react-icons/fa";
import { meetingService, Meeting } from "../../../services/meetingService"; // Import meetingService

const ScheduleCard = () => {
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
      const fetchedMeetings = await meetingService.getMeetingSchedule(); // Use meetingService
      setMeetings(fetchedMeetings);
    } catch (err) {
      setError("Failed to load schedules");
      console.error("Error fetching schedules:", err);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <p className="text-gray-500 text-sm">No schedules found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-gray-800">{meeting.course?.name}</h4>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <FaUserGraduate className="mr-2" />
                <span>{meeting.tutor?.fullName}</span>
              </div>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(meeting.status)}`}>
              {meeting.status}
            </span>
          </div>

          <div className="mt-2 text-sm text-gray-600">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-2" />
              <span>{formatDate(meeting.date)}</span> {/* Gọi với đối tượng Date */}
            </div>
            <div className="flex items-center mt-1">
              <FaClock className="mr-2" />
              <span>{formatTime(meeting.time)} ({meeting.duration} minutes)</span> {/* Gọi với đối tượng Date */}
            </div>
            {meeting.notes && (
              <p className="mt-1 text-gray-500">{meeting.notes}</p>
            )}
            {meeting.cancelledBy && meeting.cancellationReason && meeting.status === 'cancelled' && (
              <div className="mt-2 text-red-600 text-sm">
                <p>Cancelled by: {meeting.cancelledBy?.fullName}</p>
                <p>Reason: {meeting.cancellationReason}</p>
              </div>
            )}
          </div>

          {meeting.status === 'scheduled' && meeting.meetingLink && (
            <button
              onClick={() => window.open(meeting.meetingLink, '_blank')}
              className="mt-3 flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
            >
              <FaVideo />
              <span>Join Meeting</span>
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ScheduleCard;