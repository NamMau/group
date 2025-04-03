"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUser, FaCog, FaDashcube } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaDashcube />, path: "/tutor/dashboard" },
  { name: "My Courses", icon: <FaBook />, path: "/tutor/courses" },
  { name: "Appointments", icon: <FaCalendarAlt />, path: "/tutor/appointments" },
  { name: "Documents", icon: <FaFileAlt />, path: "/tutor/documents" },
  { name: "Messages", icon: <FaEnvelope />, path: "/tutor/messages" },
  { name: "Blog", icon: <FaUser />, path: "/tutor/blog" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-[calc(100vh-70px)] bg-[#F5F5F5] shadow-md fixed left-0 top-[70px] flex flex-col p-5">
      {/* Logo */}
      <h2 className="text-gray-700 font-semibold text-xl mb-6">Dashboard</h2>

      {/* Menu Items */}
      <ul className="flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.path;

          return (
            <li key={item.name}>
              <Link href={item.path}>
                <div
                  className={`flex items-center px-4 py-3 my-1 rounded-md cursor-pointer transition-all ${
                    isActive ? "bg-orange-200 text-orange-800 font-semibold shadow-sm" : "text-gray-700 hover:bg-orange-100"
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  {item.name}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Setting */}
      <div className="border-t pt-4">
        <Link href="/tutor/settings">
          <div className="flex items-center px-4 py-3 rounded-md cursor-pointer text-gray-700 hover:bg-orange-100 transition-all">
            <FaCog className="text-lg mr-3" />
            Settings
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
