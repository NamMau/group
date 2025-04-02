import React from "react";
import { FaFolderOpen, FaList, FaUpload } from "react-icons/fa";

const FileActions = () => {
  return (
    <div className="flex space-x-3">
      <button className="p-2 bg-gray-200 rounded">
        <FaFolderOpen />
      </button>
      <button className="p-2 bg-gray-200 rounded">
        <FaList />
      </button>
      <button className="p-2 bg-gray-200 rounded">
        <FaUpload />
      </button>
    </div>
  );
};

export default FileActions;
