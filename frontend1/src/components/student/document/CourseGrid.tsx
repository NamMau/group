"use client";

import React, { useState, useEffect } from "react";
import CourseCard from "./CourseCard";
import { courseService, Course } from "@/services/courseService";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";

const CourseGrid = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const token = authService.getToken();
      if (!token) {
        router.push("/student/login");
        return;
      }

      const user = authService.getUser();
      if (!user || !user._id) {
        router.push("/student/login");
        return;
      }

      const courses = await courseService.getUserCourses(user._id);
      setCourses(courses);
    } catch (err: any) {
      console.error("Error fetching courses:", err);
      setError(err.message || "Failed to load courses");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p className="text-lg font-semibold">{error}</p>
        <button
          onClick={fetchCourses}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 text-lg">No courses found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {courses.map((course) => (
        <CourseCard key={course._id} course={course} />
      ))}
    </div>
  );
};

export default CourseGrid;
