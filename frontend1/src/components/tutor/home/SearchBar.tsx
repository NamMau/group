'use client';

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { authService } from '../../../services/authService';

interface SearchBarProps {
  onSearch: (courses: any[]) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      
      if (!authService.isAuthenticated()) {
        router.push('/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/v1/courses/getcoursebyname/${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: authService.getAuthHeaders()
        }
      );

      onSearch(response.data.data || []);
    } catch (error: any) {
      console.error('Error searching courses:', error);
      if (error.response?.status === 401) {
        authService.removeToken();
        router.push('/login');
      } else {
        alert(error.response?.data?.message || 'Failed to search courses');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <input
        type="text"
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 pl-10 pr-4 text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={loading}
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <FaSearch className="w-5 h-5" />
        )}
      </button>
    </form>
  );
}