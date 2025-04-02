import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (courses: any[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push('/tutor/login');
        return;
      }

      const response = await axios.get(
        `http://localhost:5000/api/v1/courses/getcoursebyname/${encodeURIComponent(searchQuery.trim())}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      onSearch(response.data.data);
    } catch (err) {
      console.error("Error searching courses:", err);
      onSearch([]);
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
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        disabled={loading}
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
        ) : (
          <FaSearch className="text-lg" />
        )}
      </button>
    </form>
  );
};

export default SearchBar;