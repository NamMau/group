"use client";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/dashboard" },
  { name: "My Course", icon: <FaBook />, path: "/dashboard/mycourse" },
  { name: "Appointment", icon: <FaCalendarAlt />, path: "/dashboard/appointment" },
  { name: "Document", icon: <FaFileAlt />, path: "/dashboard/document" },
  { name: "Meeting", icon: <FaEnvelope />, path: "/dashboard/meeting" },
  { name: "Personal Blog", icon: <FaUser />, path: "/dashboard/blog" },
  { name: "Setting", icon: <FaCog />, path: "/dashboard/settings" },
];

const Sidebar = () => {
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-md p-5">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-orange-600 mb-8">eTutoring</h1>

      {/* Menu Items */}
      <ul>
        {menuItems.map((item) => {
          const isActive = pathname === item.path; // Kiểm tra đường dẫn chính xác

          return (
            <li
              key={item.name}
              className={`flex items-center p-3 my-2 rounded-md cursor-pointer transition-all ${
                isActive ? "bg-orange-100 text-orange-600 font-semibold" : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => (window.location.href = item.path)} // Điều hướng
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {item.name}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
