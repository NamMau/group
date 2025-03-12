"use client";
import React from "react";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import FileActions from "@/components/student/document/FileActions";
import FileTable from "@/components/student/document/FileTable";
import UploadButton from "@/components/student/document/UploadButton";
import CancelButton from "@/components/student/document/CancelButton";

const DocumentPage = () => {
  return (
    <div className="flex bg-gray-100">
      {/* Sidebar (Cố định bên trái) */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content (Dịch phải tránh sidebar) */}
      <div className="flex-1 ml-64">
        {/* Navbar (Cố định trên cùng) */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính (Thêm padding-top để tránh bị Navbar che) */}
        <div className="pt-20 p-6 overflow-auto min-h-screen">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">File Submissions</h2>

            {/* Hành động file */}
            <div className="mt-3 flex justify-between">
              <FileActions />
              <p className="text-sm text-gray-500">
                Maximum file size: 5MB, maximum number of files: 20
              </p>
            </div>

            {/* Danh sách file */}
            <div className="mt-4">
              <FileTable />
            </div>

            {/* Nút hành động */}
            <div className="flex space-x-2 mt-4">
              <UploadButton />
              <CancelButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
