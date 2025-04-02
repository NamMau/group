"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import CourseCard from "@/components/tutor/home/CourseCard";
import StudentTable from "@/components/tutor/home/StudentTable";
import SearchBar from "@/components/tutor/home/SearchBar";
import UpcomingMeeting from "@/components/tutor/home/UpcomingMeeting";
import RecentSubmissions from "@/components/tutor/home/RecentSubmissions";

const TutorDashboard = () => {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const tutorId = userData._id;

        if (!tutorId) {
          setError("Tutor ID not found");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/v1/courses/tutor-dashboard/${tutorId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(response.data.courses || []);
      } catch (err) {
        console.error("Error fetching courses:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/tutor/login');
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch courses");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen grid grid-cols-3 gap-6">
          {/* Danh sách khóa học */}
          <div className="col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">My Courses</h2>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
              >
                Refresh
              </button>
            </div>
            <SearchBar onSearch={setSearchQuery} />
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course._id}
                    title={course.name}
                    description={course.description}
                    startDate={new Date(course.startDate).toLocaleDateString()}
                    endDate={new Date(course.endDate).toLocaleDateString()}
                    onViewCourse={() => setSelectedCourse(course)}
                  />
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center py-8 bg-white rounded-lg shadow-md">
                <p className="text-gray-500">No courses found</p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-2 text-orange-500 hover:text-orange-600"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Upcoming meeting */}
          <div className="col-span-1">
            <UpcomingMeeting meetings={[]} />
          </div>

          {/* Nếu có selectedCourse, hiển thị StudentTable */}
          {selectedCourse ? (
            <div className="col-span-3">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{selectedCourse.name} - Student List</h2>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  Back to Courses
                </button>
              </div>
              <StudentTable courseId={selectedCourse._id} />
            </div>
          ) : (
            <div className="col-span-3">
              <RecentSubmissions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorDashboard;
