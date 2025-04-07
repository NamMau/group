"use client";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import SubmissionDetails from "@/components/tutor/feedback/SubmissionDetails";
import GradingSection from "@/components/tutor/feedback/GradingSection";
import AnnotatePDF from "@/components/tutor/feedback/AnnotatePDF";

const FeedbackPage = () => {
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
          <h1 className="text-2xl font-bold">Submission Feedback</h1>

          {/* Thông tin bài nộp */}
          <SubmissionDetails
            studentName="Tran Van Tuong"
            status="Submitted for grading"
            dueDate="Monday, 31 October 2025, 11:00 AM"
            timeRemaining="Document was submitted 9 days 2 hours early"
            lastModified="Monday, 31 October 2025, 11:00 AM"
            fileName="gch211342-HoangVuQuangHuy.pdf"
          />

          {/* Phần chấm điểm */}
          <GradingSection
            gradedOn="Monday, 31 October 2025, 11:00 AM"
            graderName="Kristin Watson"
            graderAvatar="https://randomuser.me/api/portraits/women/44.jpg"
            comments="Based on the actual presentation and the report, the student presents parts: Provide an introduction to procedural programming (Page ...)"
            annotatedFile="gch211342-HoangVuQuangHuy.pdf"
          />

          {/* File Annotated PDF */}
          <AnnotatePDF fileName="gch211342-HoangVuQuangHuy.pdf" fileUrl="#" />
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage
