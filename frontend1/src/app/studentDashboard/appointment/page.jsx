"use client";
import Sidebar from "@/components/studentDashboard/Sidebar";
import Navbar from "@/components/studentDashboard/Navbar";
import AppointmentHeader from "@/components/studentDashboard/appointment/AppointmentHeader";
import AppointmentList from "@/components/studentDashboard/appointment/AppointmentList";

const AppointmentPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <AppointmentHeader />
        <AppointmentList />
      </div>
    </div>
  );
};

export default AppointmentPage;
