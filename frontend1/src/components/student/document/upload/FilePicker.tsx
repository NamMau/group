"use client";
import { useState } from "react";

const FilePicker = ({ onClose }: { onClose: () => void }) => {
  const [fileName, setFileName] = useState<string>("");
  const [saveAs, setSaveAs] = useState<string>("");
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFileName(event.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px]">
        {/* Header */}
        <div className="bg-[#D9C5AE] p-3 flex justify-between items-center rounded-t-lg">
          <h2 className="text-lg font-semibold text-gray-800">File Picker</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-900 text-lg">✖</button>
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
            {/* Upload File */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Upload a file</label>
              <input type="file" onChange={handleFileChange} className="mt-1 text-sm" />
              <p className="text-xs text-gray-500 mt-1">{fileName || "Không có tệp nào được chọn"}</p>
            </div>

            {/* Save As Input */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Save as</label>
              <input 
                type="text" 
                value={saveAs}
                onChange={(e) => setSaveAs(e.target.value)}
                className="w-full border rounded-md p-2 text-sm"
              />
            </div>

            {/* Author Input (Disabled) */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input 
                type="text" 
                value="Hoàng Vũ Quang Huy" 
                disabled 
                className="w-full border bg-gray-100 rounded-md p-2 text-sm text-gray-600"
              />
            </div>

            {/* Upload Button */}
            <button 
              className="w-full bg-[#C1915F] text-white py-2 rounded-md hover:bg-[#A6784D] transition"
            >
              Upload this file
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilePicker;
