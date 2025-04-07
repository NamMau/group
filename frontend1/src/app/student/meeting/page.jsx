"use client";
import React from "react";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import MeetingList from "@/components/student/meeting/MeetingList";

const MeetingPage = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar activeItem="Meeting" />
      </div>

      {/* Main Content (Dịch phải tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6 space-y-6 overflow-auto min-h-screen">
          <h1 className="text-xl font-semibold mb-4">Meeting</h1>
          <MeetingList />
        </div>
      </div>
    </div>
  );
};

export default MeetingPage;
