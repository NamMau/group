"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import DocumentStatus from "@/components/tutor/document/submit/DocumentStatus";
import SubmitDocumentButton from "@/components/tutor/document/submit/SubmitButton";
import { documentService } from "@/services/documentService"; // Import documentService
import { authService } from "@/services/authService"; // Import authService

const DocumentDetailPage = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId");
  const documentId = searchParams.get("documentId");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!documentId) {
          throw new Error("Document ID is missing");
        }

        const token = authService.getToken();  // Lấy token từ authService
        if (!token) {
          router.push("/tutor/login");
          return;
        }

        // Sử dụng documentService để lấy tài liệu
        const documentData = await documentService.getDocumentById(documentId); // Sử dụng documentService
        setDocument(documentData);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  return (
    <div className="flex bg-gray-100 min-h-screen">
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
          <div className="bg-white p-4 rounded-lg shadow-md space-y-6">
            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : document ? (
              <>
                <h2 className="text-xl font-bold text-gray-800">Document Submission - {document.courseId}</h2>
                <p><strong>Teacher:</strong> {document.uploadedBy}</p>
                <p><strong>Due Date:</strong> {document.dueDate}</p>
                {/* Trạng thái nộp bài */}
                <DocumentStatus dueDate={document.dueDate} />
                {/* Nút upload tài liệu */}
                <SubmitDocumentButton />
              </>
            ) : (
              <p className="text-center text-gray-600">No document found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailPage;
