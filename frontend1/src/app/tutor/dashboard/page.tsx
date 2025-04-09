// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "@/components/tutor/dashboard/Sidebar";
// import Navbar from "@/components/tutor/dashboard/Navbar";
// // import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
// import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
// // import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
// // import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';
// import { authService } from '../../../services/authService';
// import { courseService } from '../../../services/courseService';
// import { FaUsers, FaBook, FaCalendarAlt } from 'react-icons/fa';

// interface DashboardData {
//   students: any[];
//   courses: any[];
//   upcomingClasses: any[];
//   recentMessages: any[];
//   tutor?: {
//     documents: any[];
//   };
// }

// export default function TutorDashboardPage() {
//   const router = useRouter();
//   const [user, setUser] = useState<any>(null);
//   const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const token = authService.getToken();
//         const userData = authService.getUser();

//         if (!token || !userData) {
//           router.replace("/tutor/login");
//           return;
//         }

//         if (userData.role !== "tutor") {
//           router.replace("/tutor/login");
//           return;
//         }

//         setUser(userData);
//         const dashboard = await courseService.getTutorDashboard(userData._id);
//         setDashboardData(dashboard);
//       } catch (error) {
//         console.error('Error checking auth:', error);
//         router.replace("/tutor/login");
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="flex">
//         <Sidebar />
//         <main className="flex-1 ml-64 mt-14 p-6">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
//             {/* Total Students */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Total Students</p>
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {dashboardData?.students?.length || 0}
//                   </h3>
//                 </div>
//                 <div className="bg-orange-100 p-3 rounded-full">
//                   <FaUsers className="text-orange-600 text-xl" />
//                 </div>
//               </div>
//             </div>

//             {/* Active Courses */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Active Courses</p>
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {dashboardData?.courses?.length || 0}
//                   </h3>
//                 </div>
//                 <div className="bg-orange-100 p-3 rounded-full">
//                   <FaBook className="text-orange-600 text-xl" />
//                 </div>
//               </div>
//             </div>

//             {/* Upcoming Appointments */}
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm">Upcoming Appointments</p>
//                   <h3 className="text-2xl font-bold text-gray-800">
//                     {dashboardData?.upcomingClasses?.length || 0}
//                   </h3>
//                 </div>
//                 <div className="bg-orange-100 p-3 rounded-full">
//                   <FaCalendarAlt className="text-orange-600 text-xl" />
//                 </div>
//               </div>
//             </div>
//           </div> {/* <-- Đóng thẻ stats grid ở đây */}

//           {/* Charts Section */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h2>
//                {dashboardData?.recentMessages || []}
//             </div>

//             {/* Nếu cần thì mở lại các biểu đồ dưới đây */}
//             {/*
//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Class Appointments</h2>
//               <ClassAppointmentsChart />
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Student Interaction</h2>
//               <StudentInteractionChart students={dashboardData?.students || []} />
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-md">
//               <h2 className="text-lg font-semibold text-gray-800 mb-4">Document Reviews</h2>
//               <DocumentReviews documents={dashboardData?.tutor?.documents || []} />
//             </div>
//             */}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
// import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
// import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
// import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';
import { authService } from '../../../services/authService';
import { courseService } from '../../../services/courseService';
import { FaUsers, FaBook, FaCalendarAlt, FaUserGraduate } from 'react-icons/fa';

interface DashboardData {
  students: any[];
  courses: any[];
  upcomingClasses: any[];
  recentMessages: any[];
  tutor?: {
    documents: any[];
  };
}

export default function TutorDashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        const userData = authService.getUser();

        if (!token || !userData) {
          router.replace("/tutor/login");
          return;
        }

        if (userData.role !== "tutor") {
          router.replace("/tutor/login");
          return;
        }

        setUser(userData);
        const dashboard = await courseService.getTutorDashboard(userData._id);
        setDashboardData(dashboard);
      } catch (error) {
        console.error('Error checking auth:', error);
        router.replace("/tutor/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

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
                    {dashboardData?.students?.length || 0}
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
                    {dashboardData?.courses?.length || 0}
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
                    {dashboardData?.upcomingClasses?.length || 0}
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
              
              {dashboardData?.students && dashboardData.students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left">
                        <th className="py-3 px-4 font-semibold">Full Name</th>
                        <th className="py-3 px-4 font-semibold">Email</th>
                        <th className="py-3 px-4 font-semibold">Courses</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-600">
                      {dashboardData.students.map((student) => (
                        <tr key={student._id} className="border-t hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{student.fullName}</td>
                          <td className="py-3 px-4">{student.email}</td>
                          <td className="py-3 px-4">
                            {dashboardData.courses
                              .filter(course => 
                                course.students.some((s: { _id: string }) => s._id === student._id)
                              )
                              .map(course => course.name)
                              .join(', ')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No students found.</p>
              )}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Messages</h2>
              {dashboardData?.recentMessages && dashboardData.recentMessages.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.recentMessages.map((message, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <p className="text-sm">{message.content || "No content available"}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent messages.</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Classes</h2>
              {dashboardData?.upcomingClasses && dashboardData.upcomingClasses.length > 0 ? (
                <div className="space-y-3">
                  {dashboardData.upcomingClasses.map((class_, index) => (
                    <div key={index} className="p-3 border rounded-lg hover:bg-gray-50">
                      <p className="font-medium">{class_.title || "Untitled Class"}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(class_.startDate).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming classes.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}