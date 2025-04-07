import Image from "next/image";

const FileSubmission = () => {
  return (
    <div className="bg-[#D9E2F3] p-4 rounded-md shadow-md border mt-4">
      <table className="w-full text-sm text-gray-800">
        <tbody>
          <tr>
            <td className="font-semibold py-2 w-1/4">File submissions</td>
            <td className="py-2 flex items-center space-x-2">
              <Image 
                src="/icons/pdf-icon.png" 
                alt="PDF Icon" 
                width={24} 
                height={24} 
              />
              <span className="text-blue-600 cursor-pointer hover:underline">
                gch211342-HoangVuQuangHuy.pdf
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="text-xs text-gray-500">31 October 2025, 11:00 AM</td>
          </tr>
          <tr>
            <td className="font-semibold py-2">Annotate PDF</td>
            <td className="py-2 flex items-center space-x-2">
              <Image 
                src="/icons/pdf-icon.png" 
                alt="PDF Icon" 
                width={24} 
                height={24} 
              />
              <span className="text-blue-600 cursor-pointer hover:underline">
                gch211342-HoangVuQuangHuy.pdf
              </span>
            </td>
          </tr>
          <tr>
            <td></td>
            <td className="py-2">
              <button className="px-3 py-1 bg-[#D1BFA0] text-gray-900 rounded-md hover:bg-[#C4A88A] transition">
                View annotated PDF
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FileSubmission;
