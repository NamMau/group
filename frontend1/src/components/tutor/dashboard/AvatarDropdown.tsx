import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  isActive: boolean;
  department?: string;
  studentId?: string;
  phoneNumber?: string;
  lastLogin?: Date;
  loginHistory?: {
    date: Date;
    ip: string;
    device: string;
  }[];
  preferences: {
    emailNotifications: boolean;
    meetingReminders: boolean;
    messageNotifications: boolean;
  };
  personalTutor?: {
    _id: string;
    fullName: string;
  };
  students?: {
    _id: string;
    fullName: string;
  }[];
}

const AvatarDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push('/tutor/login');
  };

  if (loading) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button className="focus:outline-none">
          <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
        </button>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button className="focus:outline-none">
          <Image
            src="/images/default-avatar.png"
            alt="Default Avatar"
            width={40}
            height={40}
            className="rounded-full cursor-pointer border border-gray-300"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Icon */}
      <button onClick={toggleDropdown} className="focus:outline-none">
        <Image
          src="/images/default-avatar.png"
          alt={profile.fullName}
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
              src="/images/default-avatar.png"
              alt={profile.fullName}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{profile.fullName}</h3>
              <p className="text-sm text-green-600 capitalize">{profile.role}</p>
              {profile.department && (
                <p className="text-sm text-gray-600">{profile.department}</p>
              )}
              {profile.studentId && (
                <p className="text-sm text-gray-600">ID: {profile.studentId}</p>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-3 space-y-2">
            {profile.phoneNumber && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">📱</span>
                <span>{profile.phoneNumber}</span>
              </div>
            )}
            {profile.lastLogin && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">🕒</span>
                <span>Last login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
              </div>
            )}
            {profile.students && profile.students.length > 0 && (
              <div className="flex items-center text-sm text-gray-600">
                <span className="mr-2">👥</span>
                <span>{profile.students.length} Students</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="mt-3 space-y-2">
            <button 
              onClick={() => router.push('/tutor/profile')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              View Profile
            </button>
            <button 
              onClick={() => router.push('/tutor/settings')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
            >
              Settings
            </button>
            {profile.role === 'tutor' && (
              <button 
                onClick={() => router.push('/tutor/students')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition"
              >
                Manage Students
              </button>
            )}
          </div>

          {/* Log out Button */}
          <div className="border-t pt-3 text-center">
            <button 
              onClick={handleLogout}
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
