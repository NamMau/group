"use client";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/studentDashboard" },
  { name: "My Course", icon: <FaBook />, path: "/studentDashboard/mycourse" },
  { name: "Appointment", icon: <FaCalendarAlt />, path: "/studentDashboard/appointment" },
  { name: "Document", icon: <FaFileAlt />, path: "/studentDashboard/document" },
  { name: "Meeting", icon: <FaEnvelope />, path: "/studentDashboard/meeting" },
  { name: "Personal Blog", icon: <FaUser />, path: "/studentDashboard/blog" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-56 h-screen bg-gray-100 shadow-md flex flex-col justify-between p-5">
      {/* Menu Items */}
      <ul className="flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li
              key={item.name}
              className={`flex items-center px-4 py-3 my-1 rounded-md cursor-pointer transition-all ${
                isActive ? "bg-gray-300 font-semibold" : "text-brown-700 hover:bg-gray-200"
              } ${item.name === "Dashboard" ? "text-xl font-bold" : ""}`}
              onClick={() => (window.location.href = item.path)}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.name}
            </li>
          );
        })}
      </ul>

      {/* Setting */}
      <div className="border-t pt-4">
        <div
          className="flex items-center px-4 py-3 rounded-md cursor-pointer text-brown-700 hover:bg-gray-200"
          onClick={() => (window.location.href = "/studentDashboard/settings")}
        >
          <FaCog className="text-lg mr-3" />
          Setting
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
