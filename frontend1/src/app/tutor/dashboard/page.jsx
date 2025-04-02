"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          return;
        }

        // Get tutor ID from token or user data
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const tutorId = userData._id;

        if (!tutorId) {
          setError("Tutor ID not found");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/v1/courses/tutor-dashboard/${tutorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDashboardData(response.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/tutor/login');
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content (Dịch phải để tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính (Thêm padding-top để tránh bị Navbar che) */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          {/* Tutor Profile Summary */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{dashboardData?.tutor?.fullName}</h2>
                <p className="text-gray-600">{dashboardData?.tutor?.department}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-600">{dashboardData?.tutor?.email}</p>
                <p className="text-gray-600">{dashboardData?.tutor?.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm">Total Students</h3>
              <p className="text-2xl font-bold">{dashboardData?.students?.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm">Active Courses</h3>
              <p className="text-2xl font-bold">{dashboardData?.courses?.length || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-gray-500 text-sm">Upcoming Classes</h3>
              <p className="text-2xl font-bold">{dashboardData?.upcomingClasses?.length || 0}</p>
            </div>
          </div>

          {/* Courses List */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dashboardData?.courses?.map((course) => (
                <div key={course._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-lg mb-2">{course.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">{course.description}</p>
                  <div className="text-sm text-gray-500">
                    <p>Start: {new Date(course.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(course.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
            {dashboardData?.upcomingClasses?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.upcomingClasses.map((cls) => (
                  <div key={cls._id} className="border rounded-lg p-4">
                    <h3 className="font-semibold">{cls.name}</h3>
                    <p className="text-gray-600">{cls.date}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming classes</p>
            )}
          </div>

          {/* Recent Messages */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Recent Messages</h2>
            {dashboardData?.recentMessages?.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentMessages.map((msg) => (
                  <div key={msg._id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{msg.sender}</h3>
                        <p className="text-gray-600">{msg.content}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(msg.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent messages</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
