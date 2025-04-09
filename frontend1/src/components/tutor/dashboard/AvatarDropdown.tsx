'use client';
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import { authService, API_URL } from "../../../services/authService";

interface UserProfile {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  role: 'student' | 'tutor' | 'admin';
  isActive?: boolean;
  department?: string;
  studentId?: string;
  phoneNumber?: string;
  lastLogin?: Date;
  loginHistory?: {
    date: Date;
    ip: string;
    device: string;
  }[];
  preferences?: {
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
        // First, get local user data
        const localUserData = authService.getUser();
        if (!localUserData) {
          setError("No user data available");
          setLoading(false);
          return;
        }
        
        // Set profile from local data first
        const localProfile: UserProfile = {
          id: localUserData.id,
          _id: localUserData._id,
          fullName: localUserData.fullName,
          email: localUserData.email,
          role: localUserData.role as 'student' | 'tutor' | 'admin'
        };
        setProfile(localProfile);
        setLoading(false);

        // Only try to fetch detailed profile if we have a token
        const token = authService.getToken();
        if (!token) {
          return;
        }

        // Try to get more detailed profile from API
        try {
          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data && response.data.data) {
            setProfile(response.data.data);
          }
        } catch (apiError) {
          console.error("Error fetching detailed profile:", apiError);
          // Keep using local profile data, don't redirect
        }
      } catch (err) {
        console.error("Error in profile handling:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close dropdown when clicking outside
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
    authService.removeToken();
    window.location.href = '/tutor/login';
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

  // Always show avatar with minimal functionality, even if there's an error
  if (error || !profile) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button onClick={toggleDropdown} className="focus:outline-none">
          <Image
            src="/images/default-avatar.png"
            alt="User"
            width={40}
            height={40}
            className="rounded-full cursor-pointer border border-gray-300"
          />
        </button>
        
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
            <div className="text-center border-b pb-3">
              <p className="text-sm text-gray-600">Limited profile available</p>
            </div>
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

          {/* Menu Items */}
          <div className="mt-3 space-y-2">
            <button
              onClick={() => router.push('/tutor/profile')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded transition duration-300"
            >
              Profile Settings
            </button>
            <button
              onClick={() => router.push('/tutor/preferences')}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 rounded transition duration-300"
            >
              Preferences
            </button>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded transition duration-300"
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
