"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import DocumentStatus from "@/components/student/document/submit/DocumentStatus";
import SubmitDocumentButton from "@/components/student/document/submit/SubmitButton";

const DocumentDetailPage = () => {
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const documentId = searchParams.get("documentId");

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (!documentId) {
          throw new Error("Document ID is missing");
        }

        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/student/login");
          return;
        }

        const response = await fetch(`http://localhost:5000/api/v1/documents/get-document/${documentId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch document");
        }

        setDocument(data.data);
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
                <h2 className="text-xl font-bold text-gray-800">Document Submission - {document.courseCode}</h2>
                <p><strong>Teacher:</strong> {document.teacher}</p>
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
