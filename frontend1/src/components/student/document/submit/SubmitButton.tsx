"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { documentService, Document } from "../../../../services/documentService";

interface SubmitButtonProps {
  courseId: string;
}

const SubmitDocumentButton = ({ courseId }: SubmitButtonProps) => {
  const router = useRouter();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await documentService.getStudentDocuments(courseId);
        setDocuments(data);
      } catch (err) {
        setError("Failed to load documents");
        console.error("Error fetching documents:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [courseId]);

  const handleUploadClick = () => {
    router.push("/student/document/upload");
  };

  if (isLoading) {
    return (
      <div className="text-center mt-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  const hasSubmittedDocument = documents.some(doc => doc.status === 'submitted');
  const hasGradedDocument = documents.some(doc => doc.status === 'graded');

  return (
    <div className="text-center mt-4">
      {hasGradedDocument ? (
        <div>
          <p className="text-green-600 font-medium mb-2">Your document has been graded!</p>
          <button
            onClick={handleUploadClick}
            className="bg-[#d4af87] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#c39c78] transition"
          >
            Submit New Document
          </button>
        </div>
      ) : hasSubmittedDocument ? (
        <div>
          <p className="text-blue-600 font-medium mb-2">Your document is under review</p>
          <button
            onClick={handleUploadClick}
            className="bg-[#d4af87] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#c39c78] transition"
          >
            Update Document
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleUploadClick}
            className="bg-[#d4af87] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#c39c78] transition"
          >
            Add Document
          </button>
          <p className="text-sm text-gray-500 mt-2">You have not made a document yet</p>
        </div>
      )}
    </div>
  );
};

export default SubmitDocumentButton;
