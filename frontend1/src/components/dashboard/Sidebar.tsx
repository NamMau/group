"use client";
import { useRouter } from "next/navigation";

const Sidebar = ({ activeItem }) => {
  const router = useRouter();

  const menuItems = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Course", path: "/dashboard/mycourse" },
    { name: "Appointment", path: "/dashboard/appointment" },
    { name: "Document", path: "/dashboard/document" },
    { name: "Meeting", path: "/dashboard/meeting" },
    { name: "Personal Blog", path: "/dashboard/blog" },
  ];

  return (
    <div className="w-64 bg-gray-200 h-screen p-5">
      <h2 className="text-2xl font-bold mb-5">eTutoring</h2>
      <ul>
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={`p-3 rounded-lg cursor-pointer ${
              activeItem === item.name ? "bg-orange-300" : "hover:bg-gray-300"
            }`}
            onClick={() => router.push(item.path)}
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
