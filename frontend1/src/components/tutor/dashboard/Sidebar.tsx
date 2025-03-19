"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/student" },
  { name: "Appointment", icon: <FaCalendarAlt />, path: "/student/appointment" },
  { name: "Document", icon: <FaFileAlt />, path: "/student/document" },
  { name: "Meeting", icon: <FaEnvelope />, path: "/student/meeting" },
  { name: "Personal Blog", icon: <FaUser />, path: "/student/blog" },
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
        <Link href="/student/settings">
          <div className="flex items-center px-4 py-3 rounded-md cursor-pointer text-gray-700 hover:bg-orange-100 transition-all">
            <FaCog className="text-lg mr-3" />
            Setting
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
