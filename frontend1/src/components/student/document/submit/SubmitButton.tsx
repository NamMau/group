"use client";
import { useRouter } from "next/navigation";

const SubmitDocumentButton = () => {
  const router = useRouter();

  const handleUploadClick = () => {
    router.push("/student/document/upload"); // Chuyển hướng đến trang Upload Document
  };

  return (
    <div className="text-center mt-4">
      <button
        onClick={handleUploadClick}
        className="bg-[#d4af87] text-white px-4 py-2 rounded-md shadow-md hover:bg-[#c39c78] transition"
      >
        Add Document
      </button>
      <p className="text-sm text-gray-500 mt-2">You have not made a document yet</p>
    </div>
  );
};

export default SubmitDocumentButton;
