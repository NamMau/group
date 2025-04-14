"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import { meetingService, Meeting } from "@/services/meetingService";
import { authService } from "@/services/authService";
import { FaVideo, FaCalendarAlt, FaClock, FaUserGraduate, FaBook, FaSearch } from "react-icons/fa";

const TutorMeetings = () => {
  const router = useRouter();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeetings, setFilteredMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const results = meetings.filter((meeting) =>
      meeting.notes?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMeetings(results);
  }, [searchTerm, meetings]);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = authService.getToken();
      console.log('Token:', token);
      const user = authService.getUser();
      console.log('User:', user);
      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }
      const fetchedMeetings = await meetingService.getMeetingsByTutor(user._id);
      setMeetings(fetchedMeetings);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load meetings");
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (time: string | Date): string => {
    try {
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

  const handleJoinMeeting = async (meetingId: string) => {
    try {
      const meetingLink = await meetingService.joinMeeting(meetingId);
      window.open(meetingLink, '_blank');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join meeting");
      console.error("Error joining meeting:", err);
    }
  };

  const handleCancelMeeting = async (meetingId: string) => {
    try {
      await meetingService.cancelMeeting(meetingId);
      fetchMeetings();
    } catch (err) {
      console.error("Error canceling meeting:", err);
      setError(err instanceof Error ? err.message : "Failed to cancel meeting");
    }
  };

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen fixed left-0 top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Main Content Area */}
        <div className="pt-20 px-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Meetings</h1>
              <p className="text-gray-600 mt-2">
                View and manage all your scheduled meetings
              </p>
            </div>
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                placeholder="Search by meeting notes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchMeetings}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (filteredMeetings.length === 0 && searchTerm !== "") ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No meetings found with the current search term.</p>
            </div>
          ) : (filteredMeetings.length === 0 && meetings.length === 0) ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No meetings scheduled</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeetings.map((meeting) => (
                <div
                  key={meeting._id}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {meeting.notes || 'Meeting'}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      meeting.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                      meeting.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center text-gray-600">
                      <FaCalendarAlt className="mr-2" />
                      <span>{formatDate(meeting.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaClock className="mr-2" />
                      <span>{formatTime(meeting.time)}</span>
                      <span className="mx-2">•</span>
                      <span>{meeting.duration} minutes</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaBook className="mr-2" />
                      <span>{meeting.courseId?.name || 'No course'}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FaUserGraduate className="mr-2" />
                      <span>{meeting.students.length} students</span>
                    </div>
                    {meeting.notes && (
                      <div className="text-sm text-gray-600 mt-2">
                        <p className="font-medium">Notes:</p>
                        <p>{meeting.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex gap-2">
                    {meeting._id && (
                      <button
                        onClick={() => handleJoinMeeting(meeting._id as string)}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center"
                      >
                        <FaVideo className="mr-2" />
                        Join Meeting
                      </button>
                    )}
                    {meeting.status === 'scheduled' && meeting._id && (
                      <button
                        onClick={() => handleCancelMeeting(meeting._id as string)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorMeetings;