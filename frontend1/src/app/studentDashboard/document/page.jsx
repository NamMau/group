"use client";
import React from "react";
import Sidebar from "@/components/studentDashboard/Sidebar";
import Header from "@/components/studentDashboard/Navbar";
import FileActions from "@/components/studentDashboard/document/FileActions";
import FileTable from "@/components/studentDashboard/document/FileTable";
import UploadButton from "@/components/studentDashboard/document/UploadButton";
import CancelButton from "@/components/studentDashboard/document/CancelButton";

const DocumentPage = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Nội dung chính */}
      <div className="flex-1 bg-gray-100 p-6">
        {/* Header */}
        <Header />

        {/* Nội dung */}
        <div className="bg-white p-4 rounded-lg shadow-md mt-4">
          <h2 className="text-lg font-semibold text-gray-800">File submissions</h2>

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
  );
};

export default DocumentPage;