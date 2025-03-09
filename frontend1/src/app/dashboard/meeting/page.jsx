"use client";
import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import Navbar from "@/components/dashboard/Navbar";
import MeetingList from "@/components/dashboard/MeetingList";

const MeetingPage = () => {
  return (
    <div className="flex">
      <Sidebar activeItem="Meeting" />
      <div className="flex-1 p-6">
        <Navbar />
        <h1 className="text-lg font-semibold mb-4">Meeting</h1>
        <MeetingList />
      </div>
    </div>
  );
};

export default MeetingPage;
