"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';
import { authService } from '../../../services/authService';
import { FaUsers, FaBook, FaCalendarAlt, FaStar } from 'react-icons/fa';

export default function TutorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        // Kiểm tra token
        const token = authService.getToken();
        console.log('Token:', token ? 'Found' : 'Not found');
        
        if (!token) {
          console.log('No token found, redirecting to login');
          if (isMounted) {
            router.replace("/tutor/login");
          }
          return;
        }

        // Kiểm tra user data
        const userData = authService.getUser();
        console.log('User data:', userData);
        
        if (!userData) {
          console.log('No user data found, removing token and redirecting');
          authService.removeToken();
          if (isMounted) {
            router.replace("/tutor/login");
          }
          return;
        }

        // Kiểm tra role
        if (userData.role !== "tutor") {
          console.log('User is not a tutor, removing token and redirecting');
          authService.removeToken();
          if (isMounted) {
            router.replace("/tutor/login");
          }
          return;
        }

        if (isMounted) {
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (isMounted) {
          setError("Authentication failed");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []); // Remove router from dependencies

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.replace("/tutor/login")}
            className="mt-4 px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-64 mt-14 p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Students */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Students</p>
                  <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaUsers className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Active Courses */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Active Courses</p>
                  <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaBook className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Upcoming Appointments</p>
                  <h3 className="text-2xl font-bold text-gray-800">0</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaCalendarAlt className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>

            {/* Average Rating */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Average Rating</p>
                  <h3 className="text-2xl font-bold text-gray-800">0.0</h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaStar className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Message Activity</h2>
              <MessagesChart />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Appointments</h2>
              <ClassAppointmentsChart />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Interaction</h2>
              <StudentInteractionChart />
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Reviews</h2>
              <DocumentReviews />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
