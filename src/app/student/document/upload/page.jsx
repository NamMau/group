"use client";
import React from "react";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import FileActions from "@/components/student/document/FileActions";
import FileTable from "@/components/student/document/FileTable";
import UploadButton from "@/components/student/document/UploadButton";
import CancelButton from "@/components/student/document/CancelButton";

const DocumentUploadPage = () => {
  return (
    <div className="flex bg-[#F1F1F1]">
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

        {/* Nội dung chính */}
        <div className="pt-20 p-6 overflow-auto min-h-screen">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-[#5B4636] mb-3">File Submissions</h2>

            {/* Hành động file (Các icon thư mục) */}
            <div className="flex justify-between items-center border-b pb-2">
              <FileActions />
              <p className="text-sm text-gray-600">
                Maximum file size: <b>5MB</b>, maximum number of files: <b>20</b>
              </p>
            </div>

            {/* Danh sách file */}
            <div className="mt-4 border p-3 rounded-lg bg-[#F8F8F8]">
              <FileTable />
            </div>

            {/* Nút Upload & Cancel */}
            <div className="flex justify-end space-x-3 mt-4">
              <UploadButton />
              <CancelButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadPage;
