"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import CourseCard from "./CourseCard";
import { useRouter } from "next/navigation";

interface Course {
  _id: string;
  name: string;
  description?: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  startDate?: Date;
  endDate?: Date;
  tutor?: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
  students: string[];
  status: 'not_started' | 'ongoing' | 'finished' | 'canceled';
  createdAt: Date;
  updatedAt: Date;
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState({
    status: 'all',
    level: 'all',
    category: 'all'
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("student/login");
          return;
        }

        const response = await axios.get("http://localhost:5000/api/v1/courses/get-courses", {
          headers: { Authorization: `Bearer ${token}` }
        });

        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [router]);

  const filteredCourses = courses.filter(course => {
    if (filter.status !== 'all' && course.status !== filter.status) return false;
    if (filter.level !== 'all' && course.level !== filter.level) return false;
    if (filter.category !== 'all' && course.category !== filter.category) return false;
    return true;
  });

  const handleViewCourse = (courseId: string) => {
    router.push(`/student/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="text-red-500 text-xl mb-4">Error loading courses</div>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-sm">
        <select
          value={filter.status}
          onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Status</option>
          <option value="not_started">Not Started</option>
          <option value="ongoing">Ongoing</option>
          <option value="finished">Finished</option>
          <option value="canceled">Canceled</option>
        </select>

        <select
          value={filter.level}
          onChange={(e) => setFilter(prev => ({ ...prev, level: e.target.value }))}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          value={filter.category}
          onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Frontend">Frontend</option>
          <option value="JavaScript">JavaScript</option>
          <option value="Python">Python</option>
          <option value="UI/UX">UI/UX</option>
          <option value="React">React</option>
        </select>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No courses found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <CourseCard
              key={course._id}
              course={course}
              onViewCourse={handleViewCourse}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList; 