"use client";
import React from "react";
import MeetingHeader from "@/components/Student/meeting/MeetingHeader";
import VideoGrid from "@/components/Student/meeting/VideoGrid";
import MeetingControls from "@/components/Student/meeting/MeetingControls";
import FloatingChatButton from "@/components/Student/meeting/FloatingChatButton";


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
