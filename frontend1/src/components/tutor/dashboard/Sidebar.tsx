"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaBook, FaCalendarAlt, FaUser, FaCog, FaDashcube } from "react-icons/fa";

const menuItems = [
  { name: "Home", icon: <FaHome />, path: "/tutor" },
  { name: "Dashboard", icon: <FaDashcube />, path: "/tutor/dashboard" },
  { name: "Feedback", icon: <FaBook />, path: "/tutor/feedback" },
  { name: "Appointment", icon: <FaCalendarAlt />, path: "/tutor/appointment" },
  { name: "Personal Blog", icon: <FaUser />, path: "/tutor/blog" },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-[calc(100vh-70px)] bg-[#F5F5F5] shadow-md fixed left-0 top-[70px] flex flex-col p-5">

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
            Setting
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
