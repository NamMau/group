"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { documentService, Document } from "../../../../services/documentService";

interface FileSubmissionProps {
  documentId: string;
}

const FileSubmission = ({ documentId }: FileSubmissionProps) => {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await documentService.getDocumentById(documentId);
        setDocument(data);
      } catch (err) {
        setError("Failed to load document");
        console.error("Error fetching document:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (isLoading) {
    return (
      <div className="bg-[#D9E2F3] p-4 rounded-md shadow-md border mt-4">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className="bg-[#D9E2F3] p-4 rounded-md shadow-md border mt-4">
        <div className="text-center text-red-500">
          {error || "No document found"}
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'submitted': return 'text-green-600';
      case 'graded': return 'text-blue-600';
      case 'returned': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-[#D9E2F3] p-4 rounded-md shadow-md border mt-4">
      <table className="w-full text-sm text-gray-800">
        <tbody>
          <tr>
            <td className="font-semibold py-2 w-1/4">File submissions</td>
            <td className="py-2 flex items-center space-x-2">
              <Image 
                src={`/icons/${document.fileType}-icon.png`} 
                alt={`${document.fileType.toUpperCase()} Icon`} 
                width={24} 
                height={24} 
              />
              <a 
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 cursor-pointer hover:underline"
              >
                {document.name}
              </a>
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="text-xs text-gray-500">
              Submitted: {formatDate(document.submissionDate)}
              {document.dueDate && ` | Due: ${formatDate(document.dueDate)}`}
            </td>
          </tr>
          <tr>
            <td className="font-semibold py-2">Status</td>
            <td className={`py-2 ${getStatusColor(document.status)}`}>
              {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
            </td>
          </tr>
          {document.grade && (
            <tr>
              <td className="font-semibold py-2">Grade</td>
              <td className="py-2">{document.grade}%</td>
            </tr>
          )}
          {document.feedback && (
            <tr>
              <td className="font-semibold py-2">Feedback</td>
              <td className="py-2">{document.feedback}</td>
            </tr>
          )}
          <tr>
            <td className="font-semibold py-2">File Info</td>
            <td className="py-2">
              {formatFileSize(document.fileSize)} | {document.fileType.toUpperCase()}
            </td>
          </tr>
          {document.tags && document.tags.length > 0 && (
            <tr>
              <td className="font-semibold py-2">Tags</td>
              <td className="py-2">
                {document.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1"
                  >
                    {tag}
                  </span>
                ))}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FileSubmission;
