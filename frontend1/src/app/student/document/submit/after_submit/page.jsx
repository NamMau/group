
import Navbar from "@/components/student/dashboard/Navbar";
import SubmissionDetails from "@/components/student/document/submit/SubmissionDetails";
import GradeDetails from "@/components/student/document/submit/GradeDetails";
import FileSubmission from "@/components/student/document/submit/FileSubmission";

const DocumentPage = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6">
          <SubmissionDetails />
          <FileSubmission />
          <GradeDetails />
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
