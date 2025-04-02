const SubmissionDetails = () => {
  return (
    <div className="bg-[#D9E2F3] p-4 rounded-md shadow-md border">
      <table className="w-full text-sm text-gray-800">
        <tbody>
          <tr className="border-b">
            <td className="font-semibold py-2 w-1/4">Submission Status</td>
            <td className="py-2">Submitted for grading</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold py-2">Grading status</td>
            <td className="py-2">Graded</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold py-2">Due date</td>
            <td className="py-2">Monday, 31 October 2025, 11:00 AM</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold py-2">Time remaining</td>
            <td className="py-2">Document was submitted 9 days 2 hours early</td>
          </tr>
          <tr>
            <td className="font-semibold py-2">Last modified</td>
            <td className="py-2">Monday, 31 October 2025, 11:00 AM</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default SubmissionDetails;
