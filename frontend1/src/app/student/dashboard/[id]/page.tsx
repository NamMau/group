'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { userService } from '@/services/userService';
import { courseService } from '@/services/courseService';
import TimeSpentChart from '@/components/student/dashboard/TimeSpentChart';
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";

interface DashboardData {
  studyTime: Array<{
    day: string;
    hours: number;
  }>;
  activeCourses: number;
}

export default function StudentDashboard() {
  const params = useParams();
  const studentId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!studentId) {
        setError('Student ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Verify student exists
        const student = await userService.getUser(studentId);
        if (!student) {
          throw new Error('Student not found');
        }

        // Get study time data
        const studyTime = await userService.getStudentStudyTime(studentId).catch(err => {
          console.error('Error fetching study time:', err);
          return [];
        });

        // Get active courses
        const courses = await courseService.getUserCourses(studentId).catch(err => {
          console.error('Error fetching courses:', err);
          return [];
        });

        const activeCourses = courses ? courses.length : 0;

        setDashboardData({
          studyTime,
          activeCourses
        });
      } catch (err: any) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 text-xl mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">No dashboard data available</div>
      </div>
    );
  }

  const totalStudyHours = dashboardData.studyTime.reduce((total, day) => total + day.hours, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Time Spent on Studying</h2>
            <div className="h-[400px]"> {/* Fixed height container */}
              <TimeSpentChart userId={studentId} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-6">Quick Stats</h2>
            <div className="space-y-6">
              <div className="p-6 bg-orange-50 rounded-lg">
                <p className="text-sm text-gray-600">Total Study Hours</p>
                <p className="text-3xl font-bold text-orange-600">{totalStudyHours}h</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-blue-600">{dashboardData.activeCourses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 