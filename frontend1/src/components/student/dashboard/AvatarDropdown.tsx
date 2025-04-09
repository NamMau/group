"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiSettings, FiBell, FiBookmark, FiHelpCircle, FiLogOut } from "react-icons/fi";
import { authService } from '../../../services/authService';
import { userService, User } from '../../../services/userService';

const useUserData = () => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const userData = authService.getUser();
      return userData || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = authService.getToken();
        const refreshToken = authService.getRefreshToken();
        if (!token || !refreshToken) {
          setLoading(false);
          return;
        }

        const userId = user?._id;
        if (!userId) {
          setLoading(false);
          return;
        }

        const fetchedUser = await userService.getUser(userId);
        setUser(fetchedUser);
        authService.setToken(token, refreshToken, fetchedUser);
        setError(null);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  return { user, loading, error };
};

const AvatarDropdown = () => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useUserData();
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
    authService.logout();
    router.push("/student/login");
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

  if (!user) {
    return (
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <div className = "w-10 h-10 rounded-full bg-gray-300"></div>
        </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="focus:outline-none relative group"
      >
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
      </button>

      <div
        className={`absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg p-4 z-50 transform transition-all duration-200 ease-in-out ${
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex items-center space-x-3 border-b pb-3">
          <div className="w-12 h-12 rounded-full bg-gray-300"></div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.fullName}</h3>
            <p className="text-sm text-green-600 capitalize">{user.role}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

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