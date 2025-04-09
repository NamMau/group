"use client";
import React, { useEffect, useState } from "react";
import axios, { AxiosResponse } from "axios";
import MeetingItem from "./MeetingItem";
import { authService, API_URL } from "../../../services/authService";
import { Meeting as MeetingServiceType } from "../../../services/meetingService"; // Import interface

interface Filters {
  courseId: string;
  status: string;
  startDate: string;
  endDate: string;
}

const MeetingList: React.FC = () => {
  const [meetings, setMeetings] = useState<MeetingServiceType[]>([]); // State uses MeetingServiceType
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

        const token = authService.getToken();
        if (!token) {
          setError("Please login to view meetings");
          return;
        }

        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) {
            searchParams.append(key, value);
          }
        });

        const response: AxiosResponse<MeetingServiceType[]> = await axios.get(
          `${API_URL}/meetings/get-meetings?${searchParams.toString()}`,
          {
            headers: authService.getAuthHeaders(),
          }
        );

        setMeetings(response.data.map(meeting => ({
          ...meeting,
          date: meeting.date ? new Date(meeting.date) : new Date(), // Provide a default Date if null
          time: meeting.time ? new Date(`1970-01-01T${meeting.time}Z`) : new Date(0), // Provide a default Date if null
        })));
      } catch (error: any) {
        setError(
          error?.response?.data?.message || error?.message || 'An unexpected error occurred'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [filters]);

  const handleJoinMeeting = (meetingId: string) => {
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
      {/* Filter form */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* ... filter inputs ... */}
        </div>
      </div>

      {/* Meeting list */}
      {meetings.length > 0 ? (
        <div className="space-y-4">
          {meetings.map((meeting) => (
            <MeetingItem
              key={meeting._id}
              _id={meeting._id}
              course={meeting.course}
              tutor={meeting.tutor}
              date={meeting.date}
              time={meeting.time}
              duration={meeting.duration}
              status={meeting.status}
              meetingLink={meeting.meetingLink}
              notes={meeting.notes}
              onJoinMeeting={handleJoinMeeting}
              students={meeting.students}
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