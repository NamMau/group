"use client";
import Sidebar from "@/components/studentDashboard/Sidebar";
import Navbar from "@/components/studentDashboard/Navbar";
import AppointmentForm from "@/components/studentDashboard/appointment/AppointmentForm";

const AppointmentPage = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar active="appointment" />

      {/* Nội dung chính */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Nội dung chính */}
        <div className="p-8">
          <h1 className="text-2xl font-semibold mb-4">Make an Appointment</h1>
          <AppointmentForm />
        </div>
      </div>
    </div>
  );
};

export default AppointmentPage;
