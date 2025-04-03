"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import TimeSpentChart from "@/components/student/dashboard/TimeSpentChart";
import CourseCard from "@/components/student/dashboard/CourseCard";
import { courseService } from "../../../services/courseService";
import { userService } from "../../../services/userService";

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

        // Lấy token từ local storage
        const token = localStorage.getItem("accessToken");
        console.log("Token from localStorage:", token); // Debug log

        if (!token) {
          console.log("No token found, redirecting to login"); // Debug log
          router.push("/student/login");
          return;
        }

        try {
          const decoded = jwtDecode(token);
          console.log("Decoded token:", decoded); // Debug log
          
          if (!decoded || !decoded.userId) {
            console.log("Invalid token structure"); // Debug log
            throw new Error("Invalid token structure");
          }

          const studentId = decoded.userId;

          // Gọi API lấy danh sách khóa học của sinh viên
          const coursesData = await courseService.getStudentCourses(studentId, token);
          console.log("Courses data:", coursesData); // Debug log
          setCourses(coursesData || []);

          // Gọi API lấy thời gian học tập của sinh viên
          const studyTimeData = await userService.getStudentStudyTime(studentId, token);
          console.log("Study time data:", studyTimeData); // Debug log

          // Định dạng lại dữ liệu study time để đảm bảo có đủ các ngày trong tuần
          const formattedStudyTime = studyTime.map((dayData) => {
            const foundDay = studyTimeData.find((d) => d.day === dayData.day);
            return {
              day: dayData.day,
              hours: foundDay ? foundDay.hours : 0,
            };
          });

          setStudyTime(formattedStudyTime);
        } catch (decodeError) {
          console.error("Token decode error:", decodeError); // Debug log
          throw new Error("Invalid token, please login again");
        }
      } catch (err) {
        console.error("Error in fetchDashboardData:", err); // Debug log
        setError(err.message);
        // Chỉ xóa token nếu có lỗi xác thực
        if (err.message.includes("Invalid token") || err.message.includes("Unauthorized")) {
          localStorage.removeItem("accessToken");
        }
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

                {/* Your Courses */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
                  <div className="grid grid-cols-1 gap-4">
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <CourseCard key={course._id} course={course} />
                      ))
                    ) : (
                      <p className="text-gray-500">No courses enrolled yet.</p>
                    )}
                  </div>
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
