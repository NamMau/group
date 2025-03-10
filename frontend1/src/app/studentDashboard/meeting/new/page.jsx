"use client";
import React from "react";
import MeetingHeader from "@/components/StudentDashboard/meeting/MeetingHeader";
import VideoGrid from "@/components/StudentDashboard/meeting/VideoGrid";
import MeetingControls from "@/components/StudentDashboard/meeting/MeetingControls";
import FloatingChatButton from "@/components/StudentDashboard/meeting/FloatingChatButton";


const MeetingPage = () => {
    return (
      <div className="h-screen bg-gray-900 text-white flex flex-col">
        <MeetingHeader />
        <div className="flex-grow flex items-center justify-center">
          <VideoGrid />
        </div>
        <MeetingControls />
        <FloatingChatButton />
      </div>
    );
  };
  
  export default MeetingPage;
