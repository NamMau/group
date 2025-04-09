"use client";
import React, { useState, useEffect } from "react";
import { FaFilePdf, FaFileWord, FaFileAlt, FaTrash } from "react-icons/fa";
import { documentService, Document } from "../../../../services/documentService";

interface FileTableProps {
  courseId: string;
}

const FileTable = ({ courseId }: FileTableProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) {
      setError("Course ID is missing");
      setIsLoading(false);
      return;
    }
    fetchDocuments();
  }, [courseId]);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await documentService.getStudentDocuments(courseId);
      // Đảm bảo data trả về là một mảng
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load documents";
      setError(message);
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm("Are you sure you want to delete this document?")) {
      return;
    }
    try {
      await documentService.deleteDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc._id !== documentId));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document");
    }
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FaFilePdf className="text-red-500" />;
      case "doc":
      case "docx":
        return <FaFileWord className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-4">{error}</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="text-center text-gray-500 py-4">No documents found</div>
    );
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200 text-left text-sm">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Last Modified</th>
            <th className="p-2">Size</th>
            <th className="p-2">Type</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc._id} className="border-t hover:bg-gray-50">
              <td className="p-2 flex items-center">
                <span className="mr-2">{getFileIcon(doc.fileType)}</span>
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {doc.name}
                </a>
              </td>
              <td className="p-2">{formatDate(doc.updatedAt)}</td>
              <td className="p-2">{formatFileSize(doc.fileSize)}</td>
              <td className="p-2">{doc.fileType.toUpperCase()} Document</td>
              <td className="p-2">
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
