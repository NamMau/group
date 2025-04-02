"use client";
import React from "react";
import CourseList from "@/components/student/dashboard/CourseList";
import Sidebar from "@/components/student/dashboard/Sidebar";

const MyCourse = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">My Courses</h1>
            <p className="text-gray-600 mt-2">
              View and manage all your enrolled courses
            </p>
          </div>
          <CourseList />
        </div>
      </div>
    </div>
  );
};

export default MyCourse; 