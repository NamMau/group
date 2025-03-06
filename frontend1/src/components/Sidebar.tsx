"use client";
import { useState } from "react";
import { FaHome, FaBook, FaCalendarAlt, FaFileAlt, FaEnvelope, FaUser, FaCog } from "react-icons/fa";

const menuItems = [
  { name: "Dashboard", icon: <FaHome />, path: "/" },
  { name: "My Course", icon: <FaBook />, path: "/my-course" },
  { name: "Appointment", icon: <FaCalendarAlt />, path: "/appointment" },
  { name: "Document", icon: <FaFileAlt />, path: "/document" },
  { name: "Message", icon: <FaEnvelope />, path: "/message" },
  { name: "Personal Blog", icon: <FaUser />, path: "/blog" },
  { name: "Setting", icon: <FaCog />, path: "/settings" },
];

const Sidebar = () => {
  const [active, setActive] = useState("My Course");

  return (
    <div className="w-64 h-screen bg-gray-100 shadow-md p-5">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-orange-600 mb-8">eTutoring</h1>

      {/* Menu Items */}
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`flex items-center p-3 my-2 rounded-md cursor-pointer transition-all ${
              active === item.name ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setActive(item.name)}
          >
            <span className="text-lg mr-3">{item.icon}</span>
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
