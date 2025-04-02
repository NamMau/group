"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import SubmissionDetails from "@/components/tutor/feedback/SubmissionDetails";
import GradingSection from "@/components/tutor/feedback/GradingSection";
import AnnotatePDF from "@/components/tutor/feedback/AnnotatePDF";

const FeedbackPage = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/documents/get-documents', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setDocuments(response.data);
        // Set first document as selected by default
        if (response.data.length > 0) {
          setSelectedDocument(response.data[0]);
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push('/login');
        } else {
          setError(err instanceof Error ? err.message : "Failed to fetch documents");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  if (loading) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gray-100">
        <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
          <Sidebar />
        </div>
        <div className="flex-1 ml-64 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

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

          {/* Document List */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Documents</h2>
            <div className="space-y-2">
              {documents.map((doc) => (
                <button
                  key={doc._id}
                  onClick={() => setSelectedDocument(doc)}
                  className={`w-full text-left p-3 rounded-md transition-colors ${
                    selectedDocument?._id === doc._id
                      ? 'bg-orange-100 border border-orange-500'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{doc.title}</p>
                      <p className="text-sm text-gray-500">
                        Submitted by: {doc.student.fullName}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      doc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      doc.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {selectedDocument && (
            <>
              {/* Thông tin bài nộp */}
              <SubmissionDetails
                studentName={selectedDocument.student.fullName}
                status={selectedDocument.status}
                dueDate={new Date(selectedDocument.createdAt).toLocaleString()}
                timeRemaining="Document was submitted recently"
                lastModified={new Date(selectedDocument.updatedAt).toLocaleString()}
                fileName={selectedDocument.title}
              />

              {/* Phần chấm điểm */}
              <GradingSection
                gradedOn={new Date(selectedDocument.updatedAt).toLocaleString()}
                graderName="You"
                graderAvatar="/images/avatar.jpg"
                comments={selectedDocument.feedback || "No feedback provided yet"}
                annotatedFile={selectedDocument.fileUrl}
              />

              {/* File Annotated PDF */}
              <AnnotatePDF 
                fileName={selectedDocument.title} 
                fileUrl={selectedDocument.fileUrl} 
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
