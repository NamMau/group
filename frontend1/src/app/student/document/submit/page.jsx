"use client";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import DocumentStatus from "@/components/student/document/submit/DocumentStatus";
import SubmitDocumentButton from "@/components/student/document/submit/SubmitButton";

// Dữ liệu giả lập
const document = {
  courseCode: "FA22_SSLG102",
  teacher: "Tran Van Tuong",
  dueDate: "31 October 2025, 11:00 AM",
};

const DocumentDetailPage = () => {
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
        <div className="pt-20 p-6 overflow-auto min-h-screen">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Document Submission - {document.courseCode}
            </h2>

            {/* Trạng thái nộp bài */}
            <DocumentStatus dueDate={document.dueDate} />

            {/* Nút upload tài liệu */}
            <SubmitDocumentButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
