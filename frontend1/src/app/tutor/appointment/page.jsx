"use client";

import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import Calendar from "@/components/tutor/appointment/Calendar";
import AppointmentList from "@/components/tutor/appointment/AppointmentList";

const AppointmentPage = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-screen fixed left-0 top-0">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 px-6 space-y-6 overflow-auto min-h-screen flex gap-6">
          {/* Calendar */}
          <Calendar />

          {/* Appointment List */}
          <div className="flex-1">
            <AppointmentList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
