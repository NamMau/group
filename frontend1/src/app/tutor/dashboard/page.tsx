"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
// import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
// import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
// import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';
import { authService } from '@/services/authService';
import { courseService } from '@/services/courseService';
import { FaUsers, FaBook, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';
import { CircularProgress } from '@mui/material';
import { Course } from '../../../services/courseService';
import { User } from '../../../services/userService';

interface Student {
  _id: string;
  fullName: string;
  email: string;
  isActive: boolean;
}

interface CourseData {
  _id: string;
  name: string;
  description?: string;
  students: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
}

interface Message {
  _id: string;
  content: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
  };
  recipient: {
    _id: string;
    fullName: string;
    email: string;
  };
  createdAt: Date;
}

interface Appointment {
  _id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

interface DashboardData {
  totalStudents: number;
  totalCourses: number;
  totalMessages: number;
  upcomingAppointments: Appointment[];
  recentMessages: Message[];
  courses: CourseData[];
}

export default function TutorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = authService.getUser();
        if (!userData || !userData._id) {
          console.error('No user data or user ID found:', userData);
          throw new Error('User not authenticated');
        }

        console.log('Fetching dashboard data for user:', userData._id);
        const data = await courseService.getTutorDashboard(userData._id);
        
        if (!data) {
          console.error('No data received from getTutorDashboard');
          throw new Error('No dashboard data received');
        }

        // Get all unique student IDs from courses
        const allStudentIds = Array.from(new Set(
          data.courses.flatMap((course: CourseData) => course.students)
        )) as string[];

        // Fetch student details
        const details = await courseService.getStudentDetails(allStudentIds);
        setStudentDetails(details as Student[]);

        console.log('Received dashboard data:', data);
        
        // Transform dates in the response with null checks
        const transformedData: DashboardData = {
          totalStudents: data.totalStudents || 0,
          totalCourses: data.totalCourses || 0,
          totalMessages: data.totalMessages || 0,
          upcomingAppointments: Array.isArray(data.upcomingAppointments) 
            ? data.upcomingAppointments.map((apt: any) => ({
                _id: apt._id || '',
                title: apt.title || '',
                startTime: apt.startTime ? apt.startTime.toString() : '',
                endTime: apt.endTime ? apt.endTime.toString() : '',
                status: apt.status || 'scheduled'
              }))
            : [],
          recentMessages: Array.isArray(data.recentMessages)
            ? data.recentMessages.map((msg: any) => ({
                _id: msg._id || '',
                content: msg.content || '',
                sender: msg.sender || {
                  _id: '',
                  fullName: '',
                  email: ''
                },
                recipient: msg.recipient || {
                  _id: '',
                  fullName: '',
                  email: ''
                },
                createdAt: msg.createdAt ? new Date(msg.createdAt) : new Date()
              }))
            : [],
          courses: Array.isArray(data.courses)
            ? data.courses.map((course: any) => ({
                ...course,
                students: Array.isArray(course.students) ? course.students : []
              }))
            : []
        };

        console.log('Transformed dashboard data:', transformedData);
        setDashboardData(transformedData);
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <CircularProgress />
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">
      Error: {error}
    </div>;
  }

  if (!dashboardData) {
    return <div className="text-center p-4">No dashboard data available</div>;
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
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardData?.totalStudents || 0}
                  </h3>
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
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardData?.totalCourses || 0}
                  </h3>
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
                  <h3 className="text-2xl font-bold text-gray-800">
                    {dashboardData?.upcomingAppointments?.length || 0}
                  </h3>
                </div>
                <div className="bg-orange-100 p-3 rounded-full">
                  <FaCalendarAlt className="text-orange-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Students Section */}
          <div className="mb-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Your Students</h2>
                <span className="bg-orange-100 p-2 rounded-full">
                  <FaUserGraduate className="text-orange-600" />
                </span>
              </div>
              
              {/* Course List */}
              <div className="mb-8">
                <h3 className="text-md font-medium text-gray-700 mb-3">Course Overview</h3>
                {dashboardData?.courses && dashboardData.courses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-left">
                          <th className="py-3 px-4 font-semibold">Course Name</th>
                          <th className="py-3 px-4 font-semibold">Students</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {dashboardData.courses.map((course) => (
                          <tr key={course._id} className="border-t hover:bg-gray-50">
                            <td className="py-3 px-4 font-medium">
                              {course.name}
                            </td>
                            <td className="py-3 px-4">
                              {course.students.length} students
                            </td>
                            <td className="py-3 px-4">
                              <span className={`text-xs px-2 py-1 rounded ${
                                course.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                                course.status === 'not_started' ? 'bg-yellow-100 text-yellow-800' :
                                course.status === 'finished' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {course.status.replace('_', ' ').charAt(0).toUpperCase() + 
                                 course.status.replace('_', ' ').slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No courses found.</p>
                )}
              </div>

              {/* Student List */}
              <div>
                <h3 className="text-md font-medium text-gray-700 mb-3">Student Details</h3>
                {dashboardData?.courses && studentDetails.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg">
                      <thead>
                        <tr className="bg-gray-100 text-gray-600 text-left">
                          <th className="py-3 px-4 font-semibold">Student Name</th>
                          <th className="py-3 px-4 font-semibold">Email</th>
                          <th className="py-3 px-4 font-semibold">Enrolled Courses</th>
                          <th className="py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-600">
                        {studentDetails.map((student) => {
                          const enrolledCourses = dashboardData.courses.filter(course => 
                            course.students.includes(student._id)
                          );
                          
                          return (
                            <tr key={student._id} className="border-t hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{student.fullName}</td>
                              <td className="py-3 px-4">{student.email}</td>
                              <td className="py-3 px-4">
                                {enrolledCourses.map(course => course.name).join(', ')}
                              </td>
                              <td className="py-3 px-4">
                                <span className={`text-xs px-2 py-1 rounded ${
                                  student.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {student.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No students enrolled in any courses.</p>
                )}
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h2>
              {dashboardData?.recentMessages && dashboardData.recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentMessages.map((message) => {
                    const currentUser = authService.getUser();
                    const isMessageFromTutor = message.sender._id === currentUser?._id;
                    const displayName = isMessageFromTutor ? message.recipient.fullName : message.sender.fullName;
                    
                    return (
                      <div key={message._id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{displayName}</p>
                            <span className="text-xs text-gray-500">{isMessageFromTutor ? 'To: ' : 'From: '}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{message.content || "No content available"}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent messages.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Classes</h2>
              {dashboardData?.upcomingAppointments && dashboardData.upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.upcomingAppointments.map((appointment, index: number) => (
                    <div key={appointment._id || index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <p className="font-medium">{appointment.title || "Untitled Class"}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(appointment.startTime).toLocaleString()} - {new Date(appointment.endTime).toLocaleString()}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                        appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No upcoming classes</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}