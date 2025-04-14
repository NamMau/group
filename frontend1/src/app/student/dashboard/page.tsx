"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import TimeSpentChart from "@/components/student/dashboard/TimeSpentChart";
import NotificationDropdown from "@/components/student/dashboard/NotificationDropdown";
import InboxDropdown from "@/components/student/dashboard/InboxDropdown";
import PopupMessage from "@/components/student/dashboard/PopupMessage";
import { courseService } from "../../../services/courseService";
import { userService } from "../../../services/userService";
import { authService } from "../../../services/authService";

interface User {
  _id: string;
  role: string;
  name: string;
  email: string;
}

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState<User | null>(null);
  const [activeCourses, setActiveCourses] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = authService.getToken();
        const user = authService.getUser();

        if (!token || !user || !user.role || user.role !== 'student') {
          authService.removeToken();
          router.push('/student/login');
          return;
        }

        setUserData(user);

        // Fetch active courses
        const courses = await courseService.getUserCourses(user._id);
        setActiveCourses(courses.length);

      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

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

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen fixed left-0 top-0">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-orange-600">Student Dashboard</h1>
        </div>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 pt-20 p-6 space-y-6"> {/* Added pt-20 here */}
        {/* Navbar */}
        <div className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-white shadow-md z-50">
          <Navbar />
        </div>

        {/* Time Spent Chart and Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Time Spent on Studying</h2>
            {userData && <TimeSpentChart userId={userData._id} />}
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600">Active Courses</p>
                <p className="text-2xl font-bold text-blue-600">{activeCourses}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;