'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userService } from '@/services/userService';

interface TutorDashboardData {
  tutor: {
    _id: string;
    fullName: string;
    email: string;
  };
  students: Array<{
    _id: string;
    fullName: string;
    progress: number;
    lastActivity: string;
  }>;
  upcomingMeetings: Array<{
    _id: string;
    title: string;
    startTime: string;
    duration: number;
    students: Array<{
      _id: string;
      fullName: string;
    }>;
  }>;
  messageStats: {
    totalMessages: number;
    unreadMessages: number;
    responseRate: number;
  };
}

export default function TutorDashboard() {
  const params = useParams();
  const tutorId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<TutorDashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch tutor data
        const tutor = await userService.getUser(tutorId);
        
        // Fetch additional dashboard data
        const dashboardResponse = await userService.getUserDashboard(tutorId);

        setDashboardData({
          tutor,
          ...dashboardResponse
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    if (tutorId) {
      fetchDashboardData();
    }
  }, [tutorId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="p-4 text-center">
        No dashboard data available
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {dashboardData.tutor.fullName}&apos;s Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Students Overview */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Students Overview</h2>
          <div className="space-y-4">
            {dashboardData.students.map((student) => (
              <div key={student._id} className="border-b pb-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{student.fullName}</span>
                  <span className="text-sm text-gray-500">
                    Last active: {new Date(student.lastActivity).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-1">
                  <div className="text-sm text-gray-600 flex justify-between">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded mt-1">
                    <div
                      className="bg-blue-500 rounded h-2"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upcoming Meetings</h2>
          <div className="space-y-4">
            {dashboardData.upcomingMeetings.map((meeting) => (
              <div key={meeting._id} className="border-b pb-2">
                <div className="font-medium">{meeting.title}</div>
                <div className="text-sm text-gray-600">
                  <div>Time: {new Date(meeting.startTime).toLocaleString()}</div>
                  <div>Duration: {meeting.duration} minutes</div>
                  <div>
                    Students: {meeting.students.map(s => s.fullName).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Statistics */}
        <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Message Statistics</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {dashboardData.messageStats.totalMessages}
              </div>
              <div className="text-sm text-gray-600">Total Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {dashboardData.messageStats.unreadMessages}
              </div>
              <div className="text-sm text-gray-600">Unread Messages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {dashboardData.messageStats.responseRate}%
              </div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 