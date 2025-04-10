import Sidebar from "@/components/tutor/dashboard/Sidebar";
import Navbar from "@/components/tutor/dashboard/Navbar";
import SubmissionDetails from "@/components/tutor/document/submit/SubmissionDetails";
import GradeDetails from "@/components/tutor/document/submit/GradeDetails";
import FileSubmission from "@/components/tutor/document/submit/FileSubmission";

const DocumentPage = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md h-[calc(100vh-70px)] fixed left-0 top-[70px]">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Navbar */}
        <div className="fixed top-0 left-64 w-[calc(100%-16rem)] h-16 bg-white shadow-md flex items-center px-6 z-50">
          <Navbar />
        </div>

        {/* Nội dung chính */}
        <div className="pt-20 p-6 space-y-6">
          <SubmissionDetails />
          <FileSubmission />
          <GradeDetails />
        </div>
      </div>
    </div>
  );
};

export default DocumentPage;
