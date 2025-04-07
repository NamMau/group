"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter để chuyển trang
import Image from "next/image";

const AvatarDropdown = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Hook để chuyển hướng trang

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  

  // Xử lý sự kiện logout
  const handleLogout = () => {
    console.log("Đang đăng xuất...");
    // Xóa dữ liệu user khỏi localStorage hoặc context (nếu có)
    localStorage.removeItem("userToken"); // Xóa token user (nếu dùng)
    
    // Chuyển hướng về trang đăng nhập
    router.push("/login");
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Icon */}
      <button onClick={toggleDropdown} className="focus:outline-none">
        <Image
          src="/images/avatar.png" // Thay bằng đường dẫn avatar của user
          alt="User Avatar"
          width={40}
          height={40}
          className="rounded-full cursor-pointer border border-gray-300 hover:border-orange-500 transition duration-300"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
          {/* Header - User Info */}
          <div className="flex items-center space-x-3 border-b pb-3">
            <Image
              src="/images/avatar.png" // Thay bằng đường dẫn avatar của user
              alt="User Avatar"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">Hoang Vu Quang Huy</h3>
              <p className="text-sm text-green-600">Student</p>
              <div className="w-full bg-gray-200 h-1 mt-1 rounded-full">
                <div className="bg-green-500 h-1 rounded-full w-2/3"></div>
              </div>
            </div>
          </div>

          {/* Reminders Section */}
          <div className="mt-3">
            <h4 className="text-sm font-semibold text-gray-600 mb-2">Reminders</h4>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="flex items-center space-x-3 mb-2">
                <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  10am
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Bootstrap test</p>
                  <p className="text-xs text-gray-500">Thursday</p>
                </div>
              </div>
            ))}
          </div>

          {/* Log out Button */}
          <div className="border-t pt-3 text-center">
            <button
              onClick={handleLogout} // Thêm sự kiện logout
              className="text-orange-700 text-sm font-semibold hover:text-orange-900 transition duration-300"
            >
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AvatarDropdown;
