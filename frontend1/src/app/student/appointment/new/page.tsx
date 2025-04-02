"use client";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/student/dashboard/Sidebar";
import Navbar from "@/components/student/dashboard/Navbar";
import AppointmentForm from "@/components/student/appointment/AppointmentForm";

const NewAppointmentPage = () => {
  const router = useRouter();

  const handleSubmit = (appointment: any) => {
    // Xử lý sau khi tạo appointment thành công
    router.push("/student/appointments");
  };

  return (
    <div className="flex bg-gray-100">
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

        {/* Content */}
        <div className="pt-20 p-6 overflow-auto min-h-screen">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Create New Appointment</h1>
                  <p className="text-gray-600 mt-1">Schedule a tutoring session with your preferred tutor</p>
                </div>
                <button
                  onClick={() => router.back()}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <AppointmentForm onSubmit={handleSubmit} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewAppointmentPage; 