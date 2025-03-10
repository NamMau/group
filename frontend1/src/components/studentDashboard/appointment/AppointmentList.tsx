import AppointmentCard from "@/components/studentDashboard/appointment/AppointmentCard";

const appointments = [
  { course: "Math 101", tutor: "John Doe", date: "30/06/2024, 10:00 AM", status: "Not confirmed" },
  { course: "Physics 202", tutor: "Jane Smith", date: "02/07/2024, 2:00 PM", status: "Confirmed" },
];

const AppointmentList: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {appointments.map((app, index) => (
        <AppointmentCard key={index} {...app} />
      ))}
    </div>
  );
};

export default AppointmentList;
