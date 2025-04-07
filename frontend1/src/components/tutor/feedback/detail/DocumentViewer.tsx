import { FaChevronLeft, FaChevronRight, FaTimes, FaDownload } from "react-icons/fa";

const DocumentViewer = () => {
  return (
    <div className="flex-1 bg-gray-50 p-5 relative border rounded-lg">
      <h3 className="text-center mb-3">Watching Document</h3>
      <div className="absolute top-3 right-3 cursor-pointer text-gray-600 hover:text-red-500">
        <FaTimes size={20} />
      </div>
      <div className="flex justify-between mt-5">
        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          <FaChevronLeft />
        </button>
        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          <FaChevronRight />
        </button>
      </div>
      <div className="absolute bottom-3 right-3 cursor-pointer text-gray-600 hover:text-blue-500">
        <FaDownload size={20} />
      </div>
    </div>
  );
};

export default DocumentViewer;
