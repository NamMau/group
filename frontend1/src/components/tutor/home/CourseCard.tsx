import { FaHtml5, FaCss3Alt, FaJs, FaPython, FaBootstrap, FaReact } from "react-icons/fa";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchBar from "./SearchBar";

interface Course {
  _id: string;
  name: string;
  description: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  startDate: string;
  endDate: string;
  tutor: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  students: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
  createdAt: string;
  updatedAt: string;
}

interface CourseCardProps {
  onViewCourse: (courseId: string) => void;
}

const levelColors = {
  Beginner: 'bg-green-100 text-green-800',
  Intermediate: 'bg-yellow-100 text-yellow-800',
  Advanced: 'bg-red-100 text-red-800'
};

const statusColors = {
  not_started: 'bg-gray-100 text-gray-800',
  ongoing: 'bg-blue-100 text-blue-800',
  finished: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800'
};

const CourseCard: React.FC<CourseCardProps> = ({ onViewCourse }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/courses/get-courses', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(response.data.data);
        setFilteredCourses(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const handleSearch = (searchResults: Course[]) => {
    setFilteredCourses(searchResults);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="max-w-md mx-auto">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div 
            key={course._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {/* Course Header */}
            <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">{course.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${levelColors[course.level]}`}>
                  {course.level}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12">
                  <Image
                    src={course.tutor.avatar || "/images/default-avatar.png"}
                    alt={course.tutor.fullName}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{course.tutor.fullName}</p>
                  <p className="text-xs text-gray-500">{course.category}</p>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="p-4">
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
              
              {/* Course Stats */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm">{course.students.length} students</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[course.status]}`}>
                  {course.status.replace('_', ' ')}
                </span>
              </div>

              {/* Course Dates */}
              <div className="text-sm text-gray-500 mb-4">
                <p>Start: {new Date(course.startDate).toLocaleDateString()}</p>
                <p>End: {new Date(course.endDate).toLocaleDateString()}</p>
              </div>

              {/* Action Button */}
      <button
                onClick={() => onViewCourse(course._id)}
                className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition"
      >
                View Details
      </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results Message */}
      {filteredCourses.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No courses found. Try a different search term.
        </div>
      )}
    </div>
  );
};

export default CourseCard;
