import React from "react";

interface DocumentStatusProps {
  dueDate: string;
}

const DocumentStatus: React.FC<DocumentStatusProps> = ({ dueDate }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <table className="w-full border-collapse">
        <tbody>
          <tr className="bg-blue-100">
            <th className="text-left p-2 font-semibold">Submission Status</th>
            <td className="p-2">Not attempt</td>
          </tr>
          <tr className="bg-blue-100">
            <th className="text-left p-2 font-semibold">Grading Status</th>
            <td className="p-2">Not graded</td>
          </tr>
          <tr className="bg-gray-100">
            <th className="text-left p-2 font-semibold">Due Date</th>
            <td className="p-2">{dueDate}</td>
          </tr>
          <tr className="bg-blue-100">
            <th className="text-left p-2 font-semibold">Time Remaining</th>
            <td className="p-2">30 days 9 hours</td>
          </tr>
          <tr className="bg-gray-100">
            <th className="text-left p-2 font-semibold">Last Modified</th>
            <td className="p-2">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DocumentStatus;
