"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { FiSettings, FiBell, FiBookmark, FiHelpCircle, FiLogOut } from "react-icons/fi";

interface User {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  role: string;
}

const useUserData = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          router.push("student/login");
          return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
          setError("No user ID found");
          router.push("student/login");
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/v1/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch user data");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  return { user, loading, error };
};

const AvatarDropdown = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading, error } = useUserData();
  const router = useRouter();

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    router.push(path);
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
    );
  }

  if (error) {
    return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-red-500 text-xs">!</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Icon */}
      <button 
        onClick={toggleDropdown} 
        className="focus:outline-none relative group"
      >
        <div className="relative w-10 h-10">
          <Image
            src={user.avatar || "/default-avatar.jpg"}
            alt={user.fullName}
            fill
            className="rounded-full object-cover border border-gray-300 group-hover:border-orange-500 transition duration-300"
            sizes="40px"
          />
        </div>
      </button>

      {/* Dropdown Menu */}
      <div 
        className={`absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transform transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {/* Header - User Info */}
        <div className="flex items-center space-x-3 border-b pb-3">
          <div className="relative w-12 h-12">
            <Image
              src={user.avatar || "/default-avatar.jpg"}
              alt={user.fullName}
              fill
              className="rounded-full object-cover"
              sizes="48px"
            />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-green-600 capitalize">{user.role}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mt-3 space-y-1">
          <button
            onClick={() => handleNavigation("/student/profile")}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiSettings className="text-gray-500" />
            <span>Profile Settings</span>
          </button>
          <button
            onClick={() => handleNavigation("/student/notifications")}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiBell className="text-gray-500" />
            <span>Notifications</span>
          </button>
          <button
            onClick={() => handleNavigation("/student/saved")}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiBookmark className="text-gray-500" />
            <span>Saved Items</span>
          </button>
          <button
            onClick={() => handleNavigation("/student/help")}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiHelpCircle className="text-gray-500" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Log out Button */}
        <div className="border-t pt-3 mt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <FiLogOut />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarDropdown;
