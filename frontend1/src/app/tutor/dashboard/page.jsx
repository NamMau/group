"use client";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import ClassAppointmentsChart from '@/components/tutor/dashboard/ClassAppointmentsChart';
import MessagesChart from '@/components/tutor/dashboard/MessagesChart';
import StudentInteractionChart from '@/components/tutor/dashboard/StudentInteractionChart';
import DocumentReviews from '@/components/tutor/dashboard/DocumentReviews';

export default function Dashboard() {
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Class Appointments Chart (Chiếm 2 cột trên desktop) */}
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Class Appointments</h2>
              <ClassAppointmentsChart />
            </div>

            {/* Student Interaction Chart (Chiếm 1 cột) */}
            <div className="bg-white p-6 rounded-lg shadow-md h-[320px] overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Student Interactions</h2>
              <StudentInteractionChart />
            </div>
          </div>

          {/* Additional Data Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Messages Chart */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Messages</h2>
              <MessagesChart />
            </div>

            {/* Document Reviews */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Document Reviews</h2>
              <DocumentReviews />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
