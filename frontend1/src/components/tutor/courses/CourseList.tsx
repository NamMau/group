'use client';

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { format } from "date-fns";
import { authService } from "../../../services/authService";
import { courseService } from '../../../services/courseService';

interface Course {
  _id: string;
  name: string;
  description: string;
  startDate: string; 
  endDate: string;   
}

const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const user = authService.getUser();
        if (!user || !user._id) {
          setError("Tutor ID not found");
          setLoading(false);
          return;
        }

        const tutorId = user._id;
        const fetchedCourses = await courseService.getCoursesByTutor(tutorId);


        const parsedCourses: Course[] = (fetchedCourses || []).map((course: any) => ({
          ...course,
          startDate: course.startDate || "",
          endDate: course.endDate || "",
        }));

        setCourses(parsedCourses);
        setError(null);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if(courses.length === 0) {
    return <div className="text-center text-gray-700">No courses available right now!</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {courses.map((course) => (
        <div key={course._id} onClick={() => router.push(`/tutor/courses/${course._id}`)} 
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition">
          <h3 className="font-semibold text-lg">{course.name}</h3>
          <p className="text-gray-600 text-sm mt-2">{course.description}</p>
          <p className="text-gray-500 text-xs mt-2">
            Start Date: {course.startDate ? format(new Date(course.startDate), 'dd/MM/yyyy') : 'N/A'}
          </p>
          <p className="text-gray-500 text-xs">
            End Date: {course.endDate ? format(new Date(course.endDate), 'dd/MM/yyyy') : 'N/A'}
          </p>
        </div>
      ))}
    </div>
  );
};

export default CourseList;
