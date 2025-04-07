import { FaFilePdf } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";


interface GradingSectionProps {
  gradedOn: string;
  graderName: string;
  graderAvatar: string;
  comments: string;
  annotatedFile: string;
}

const GradingSection = ({
  gradedOn,
  graderName,
  graderAvatar,
  comments,
  annotatedFile,
}: GradingSectionProps) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md mt-5">
      {/* Grade On */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Grade on</span>
        <span>{gradedOn}</span>
      </div>

      {/* Grader Info */}
      <div className="flex items-center py-2">
        <Image
          src={graderAvatar}
          alt="Grader Avatar"
          width={32}
          height={32}
          className="w-8 h-8 rounded-full mr-2"
        />
        <span className="font-semibold">{graderName}</span>
      </div>

      {/* Comments */}
      <div className="bg-blue-100 p-3 rounded-lg mt-2">
        <p>{comments}</p>
      </div>

      {/* Add Comment Button */}
      <Link href="/tutor/feedback/detail">
        <button className="mt-3 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
          Add comment
        </button>
      </Link>


      {/* Annotated PDF */}
      <div className="flex items-center py-2 mt-3">
        <FaFilePdf className="text-red-500 text-lg mr-2" />
        <span className="text-blue-600 hover:underline cursor-pointer">{annotatedFile}</span>
      </div>

      {/* View Annotated PDF Button */}
      <button className="mt-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
        View annotated PDF
      </button>
    </div>
  );
};

export default GradingSection;
