"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MeetingItem from "./MeetingItem";

interface Meeting {
  _id: string;
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
}

interface Filters {
  courseId: string;
  status: string;
  startDate: string;
  endDate: string;
}

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    courseId: "",
    status: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login to view meetings");
          return;
        }

        // Convert filters to URLSearchParams safely
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            searchParams.append(key, value);
          }
        });

        const response = await axios.get(`http://localhost:5000/api/v1/meetings/get-meetings?${searchParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setMeetings(response.data);
      } catch (error) {
        setError(
          error && typeof error === 'object' && 'response' in error 
            ? (error.response as any)?.data?.message || 'Unknown error occurred'
            : error instanceof Error 
              ? error.message 
              : 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [filters]);

  const handleJoinMeeting = (meetingId: string) => {
    // This will be handled by MeetingItem component
    console.log("Joining meeting:", meetingId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
    <div className="space-y-4">
      {/* Form chọn bộ lọc */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Course
            </label>
            <input
              type="text"
              placeholder="Filter by course"
              value={filters.courseId}
              onChange={(e) => setFilters({ ...filters, courseId: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Danh sách cuộc họp */}
      {meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting._id}
              meetingId={meeting._id}
              courseId={meeting.courseId}
              courseName={meeting.courseName}
              tutorId={meeting.tutorId}
              tutorName={meeting.tutorName}
              date={meeting.date}
              startTime={meeting.startTime}
              endTime={meeting.endTime}
              duration={meeting.duration}
              status={meeting.status}
              meetingLink={meeting.meetingLink}
              notes={meeting.notes}
              onJoinMeeting={handleJoinMeeting}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-500 text-lg">No meetings available.</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default MeetingList;
