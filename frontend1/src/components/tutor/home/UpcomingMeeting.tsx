import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSpinner, FaVideo, FaCalendarAlt, FaClock, FaUsers } from "react-icons/fa";

interface Meeting {
  _id: string;
  title: string;
  class: {
    _id: string;
    name: string;
  };
  startTime: string;
  endTime: string;
  date: string;
  participants: {
    _id: string;
    fullName: string;
    avatar?: string;
  }[];
  status: 'scheduled' | 'in-progress' | 'completed';
  meetingLink?: string;
}

const UpcomingMeeting = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/meetings/upcoming', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setMeetings(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch meetings");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-4xl text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h3>
        <p className="text-gray-500 text-center">No upcoming meetings scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Meetings</h3>
      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div key={meeting._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-lg font-medium text-gray-900">{meeting.title}</h4>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(meeting.status)}`}>
                {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <FaUsers className="mr-2" />
                <span>Class: {meeting.class.name}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="mr-2" />
                <span>Date: {formatDate(meeting.date)}</span>
              </div>
              
              <div className="flex items-center text-gray-600">
                <FaClock className="mr-2" />
                <span>Time: {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 3).map((participant) => (
                  <img
                    key={participant._id}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    src={participant.avatar || "/images/default-avatar.png"}
                    alt={participant.fullName}
                  />
                ))}
                {meeting.participants.length > 3 && (
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                    +{meeting.participants.length - 3}
                  </div>
                )}
              </div>

              <button
                onClick={() => meeting.meetingLink && window.open(meeting.meetingLink, '_blank')}
                className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                <FaVideo className="mr-2" />
                Join Meeting
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeeting;