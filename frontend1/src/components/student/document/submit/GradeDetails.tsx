import Image from "next/image";

const GradeDetails = () => {
  return (
    <div className="bg-[#B7CCE6] p-4 rounded-md shadow-md border mt-6">
      <table className="w-full text-sm text-gray-800">
        <tbody>
          <tr className="border-b">
            <td className="font-semibold py-2 w-1/4">Grade</td>
            <td className="py-2">Pass</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold py-2">Grade on</td>
            <td className="py-2">Monday, 31 October 2025, 11:00 AM</td>
          </tr>
          <tr className="border-b">
            <td className="font-semibold py-2">Grade by</td>
            <td className="py-2 flex items-center space-x-2">
              <Image 
                src="/icons/avatar.png" 
                alt="Grader Avatar" 
                width={24} 
                height={24} 
                className="rounded-full"
              />
              <span>Kristin Watson</span>
            </td>
          </tr>
          <tr>
            <td className="font-semibold py-2">Grade on</td>
            <td className="py-2">
              Based on the actual presentation and the report, the student presents parts:
              Provide an introduction to procedural programming (Page ...)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default GradeDetails;
