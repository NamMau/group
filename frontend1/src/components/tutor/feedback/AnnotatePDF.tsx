import { FaFilePdf } from "react-icons/fa";

interface AnnotatePDFProps {
  fileName: string;
  fileUrl: string;
}

const AnnotatePDF = ({ fileName, fileUrl }: AnnotatePDFProps) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
      <h3 className="font-semibold">Annotate PDF</h3>
      
      {/* File PDF */}
      <div className="flex items-center py-2">
        <FaFilePdf className="text-red-500 text-lg mr-2" />
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {fileName}
        </a>
      </div>

      {/* Nút xem Annotated PDF */}
      <a href={fileUrl} target="_blank" rel="noopener noreferrer">
        <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
          View annotated PDF
        </button>
      </a>
    </div>
  );
};

export default AnnotatePDF;
