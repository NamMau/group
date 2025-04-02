"use client";
import { useState, useRef } from "react";
import { documentService } from "../../../../services/documentService";
import { useRouter } from "next/navigation";

interface FilePickerProps {
  onClose: () => void;
  courseId: string;
}

const FilePicker = ({ onClose, courseId }: FilePickerProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [saveAs, setSaveAs] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      setFileName(selectedFile.name);
      // Set default save as name if not set
      if (!saveAs) {
        setSaveAs(selectedFile.name);
      }
      setError(null);
    } else {
      setFile(null);
      setFileName("");
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file to upload");
      return;
    }

    if (!saveAs.trim()) {
      setError("Please enter a name for the file");
      return;
    }

    // Validate file type
    const allowedTypes = ['pdf', 'doc', 'docx', 'txt'];
    const fileType = file.name.split('.').pop()?.toLowerCase();
    if (!fileType || !allowedTypes.includes(fileType)) {
      setError("Invalid file type. Allowed types: PDF, DOC, DOCX, TXT");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', saveAs);
      formData.append('courseId', courseId);

      await documentService.uploadDocument(formData);
      
      // Reset form
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setFile(null);
      setFileName("");
      setSaveAs("");
      
      // Close modal and refresh page
      onClose();
      router.refresh();
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Error uploading file:", err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        {/* Header */}
        <div className="bg-[#D9C5AE] p-3 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">Upload Document</h2>
          <button 
            onClick={onClose} 
            className="text-gray-600 hover:text-gray-900 text-lg"
            disabled={isUploading}
          >
            ✖
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 bg-[#EFE4D7] p-4 flex flex-col items-center">
            <div className="text-gray-700 text-sm flex flex-col items-center">
              📂 <span className="mt-2">Upload a file</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-4">
            {error && (
              <div className="mb-3 p-2 bg-red-100 text-red-700 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Upload File */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Upload a file</label>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="mt-1 text-sm"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx,.txt"
                disabled={isUploading}
              />
              <p className="text-xs text-gray-500 mt-1">
                {fileName || "No file selected"}
                {file && ` (${(file.size / 1024 / 1024).toFixed(2)} MB)`}
              </p>
            </div>

            {/* Save As Input */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Save as</label>
              <input 
                type="text" 
                value={saveAs}
                onChange={(e) => setSaveAs(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
                disabled={isUploading}
              />
            </div>

            {/* Upload Button */}
            <button 
              onClick={handleUpload}
              disabled={isUploading || !file}
              className={`w-full py-2 rounded-md transition ${
                isUploading || !file
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#C1915F] hover:bg-[#A6784D] text-white'
              }`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Uploading...
                </div>
              ) : (
                'Upload this file'
              )}
            </button>

            {isUploading && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-[#C1915F] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {uploadProgress}% complete
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
