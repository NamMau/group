import { FaFilePdf } from "react-icons/fa";

interface SubmissionDetailsProps {
  studentName: string;
  status: string;
  dueDate: string;
  timeRemaining: string;
  lastModified: string;
  fileName: string;
}

const SubmissionDetails = ({
  studentName,
  status,
  dueDate,
  timeRemaining,
  lastModified,
  fileName,
}: SubmissionDetailsProps) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg shadow-md">
      {/* Student Name */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Student name</span>
        <span className="bg-blue-100 px-3 py-1 rounded">{studentName}</span>
      </div>

      {/* Submission Status */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Submission Status</span>
        <span>{status}</span>
      </div>

      {/* Due Date */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Due date</span>
        <span>{dueDate}</span>
      </div>

      {/* Time Remaining */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Time remaining</span>
        <span className="bg-blue-100 px-3 py-1 rounded">{timeRemaining}</span>
      </div>

      {/* Last Modified */}
      <div className="flex justify-between py-2">
        <span className="font-semibold">Last modified</span>
        <span>{lastModified}</span>
      </div>

      {/* File Submission */}
      <div className="flex items-center py-2">
        <FaFilePdf className="text-red-500 text-lg mr-2" />
        <span className="text-blue-600 hover:underline cursor-pointer">{fileName}</span>
      </div>
    </div>
  );
};

export default SubmissionDetails;
