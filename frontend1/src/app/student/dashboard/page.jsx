"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jwt-decode";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import TimeSpentChart from "@/components/student/dashboard/TimeSpentChart";
import ProgressList from "@/components/student/dashboard/ProgressList";
import CourseCard from "@/components/student/dashboard/CourseCard";

const StudentDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [studyTime, setStudyTime] = useState([
    { day: "Mon", hours: 0 },
    { day: "Tue", hours: 0 },
    { day: "Wed", hours: 0 },
    { day: "Thu", hours: 0 },
    { day: "Fri", hours: 0 },
    { day: "Sat", hours: 0 },
    { day: "Sun", hours: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        //took token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/student/login");
          return;
        }

        const decoded = jwtDecode(token);
        const studentId = decoded?.userId;

        if (!studentId) {
          throw new Error("Invalid token, please login again");
        }

        // Gọi API lấy danh sách khóa học của sinh viên
        const coursesRes = await fetch(`http://localhost:5000/api/v1/courses/student-dashboard/${studentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const coursesData = await coursesRes.json();

        if (!coursesRes.ok || !coursesData.success) {
          throw new Error(coursesData.message || "Failed to fetch courses");
        }

        // Gọi API lấy thời gian học tập của sinh viên
        const studyTimeRes = await fetch(`http://localhost:5000/api/v1/users/students/${studentId}/study-time`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let studyTimeData;
        try {
          studyTimeData = await studyTimeRes.json();
        } catch (error) {
          throw new Error("Invalid JSON response from study time API");
        }

        if (!studyTimeRes.ok || !studyTimeData.success) {
          throw new Error(studyTimeData.message || "Failed to fetch study time data");
        }

        if (!studyTimeData.data || !Array.isArray(studyTimeData.data)) {
          throw new Error("Study time data is missing or not in expected format");
        }

        // Định dạng lại dữ liệu study time để đảm bảo có đủ các ngày trong tuần
        const formattedStudyTime = studyTime.map((dayData) => {
          const foundDay = studyTimeData.data.find((d) => d.day === dayData.day);
          return {
            day: dayData.day,
            hours: foundDay ? foundDay.hours : 0,
          };
        });

        setCourses(coursesData.data || []);
        setStudyTime(formattedStudyTime);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("token");
        router.push("/student/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          {loading ? (
            <p className="text-center text-gray-600">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Time Spent Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Time Spent on Studying</h2>
                  <TimeSpentChart studyTime={studyTime} />
                </div>

                {/* Latest Progress */}
                <div className="bg-white p-6 rounded-lg shadow-md h-[320px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Latest Progress</h2>
                  <ProgressList />
                </div>
              </div>

              {/* Your Courses */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {courses.length > 0 ? (
                    courses.map((course) => <CourseCard key={course._id} title={course.name} icon="book" />)
                  ) : (
                    <p className="text-gray-500">No courses enrolled yet.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
