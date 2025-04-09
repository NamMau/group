"use client";
import { useState } from "react";
// Không cần import File từ 'node:buffer' vì ở trình duyệt, lớp File là toàn cục
// import { File } from 'node:buffer';
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import FileActions from "@/components/student/document/upload/FileActions";
import FileTable from "@/components/student/document/upload/FileTable";
import CancelButton from "@/components/student/document/upload/CancelButton";
import FilePicker from "@/components/student/document/upload/FilePicker"; // Import FilePicker
import { documentService } from "@/services/documentService"; // Import documentService
import { authService } from "@/services/authService"; // Import authService

const DocumentUploadPage = () => {
  const [isFilePickerOpen, setIsFilePickerOpen] = useState(false);
  // Khai báo state cho files
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ví dụ: Tạo file bằng lớp File toàn cục (nếu cần test)
  const exampleFile = new File(["content"], "filename.txt", { type: "text/plain" });
  console.log("Example file:", exampleFile);

  // Xử lý khi người dùng chọn file
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(selectedFiles);
  };

  // Gửi file lên server
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("Please select at least one file.");
      return;
    }

    // Kiểm tra số lượng file (các bạn đề cập là 20 file tối đa)
    if (files.length > 20) {
      setError("You can upload a maximum of 20 files.");
      return;
    }

    // Tính tổng kích thước các file
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 5 * 1024 * 1024) {
      setError("Total file size exceeds 5MB.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      const token = authService.getToken(); // Lấy token từ authService
      if (!token) {
        setError("You are not authenticated.");
        return;
      }

      // Gửi request sử dụng documentService
      const response = await documentService.uploadDocument(formData, token);

      // Xử lý kết quả trả về từ server
      if (response) {
        setFiles([]); // Xóa danh sách file sau khi tải lên thành công
        setError(""); // Xóa lỗi nếu có
      }
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#F1F1F1]">
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold text-[#5B4636] mb-3">File Submissions</h2>

            {/* Hành động file */}
            <div className="flex justify-between items-center border-b pb-2">
              <FileActions />
              <p className="text-sm text-gray-600">
                Maximum file size: <b>5MB</b>, maximum number of files: <b>20</b>
              </p>
            </div>

            {/* Danh sách file đã chọn */}
            <div className="mt-4 border p-3 rounded-lg bg-[#F8F8F8]">
              <FileTable files={files} />
            </div>

            {/* Hiển thị lỗi nếu có */}
            {error && <p className="text-red-500 mt-2">{error}</p>}

            {/* Nút Upload & Cancel */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsFilePickerOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Upload File
              </button>
              <CancelButton onCancel={() => setFiles([])} />
            </div>

            {/* Hiển thị trạng thái tải lên */}
            {loading && <p className="text-center text-blue-500">Uploading...</p>}
          </div>
        </div>
      </div>

      {/* Hiển thị FilePicker nếu mở */}
      {isFilePickerOpen && <FilePicker onClose={() => setIsFilePickerOpen(false)} onFileChange={handleFileChange} />}
    </div>
  );
};

export default DocumentUploadPage;
