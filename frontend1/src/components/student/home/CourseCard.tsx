// CourseCard.tsx
"use client";
import React from "react";
import { JSX } from "react";
import { FaHtml5, FaCss3Alt, FaJs, FaPython, FaBootstrap, FaReact } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "../../../services/authService";
import { courseService, Course } from "../../../services/courseService";
import { toast } from "react-hot-toast";

export interface CourseCardProps {
  course: Course;
  onViewCourse?: (courseId: string) => void;
  onEnrollSuccess?: () => void;
}

const levelColors = {
  'Beginner': 'bg-green-100 text-green-800',
  'Intermediate': 'bg-yellow-100 text-yellow-800',
  'Advanced': 'bg-red-100 text-red-800'
};

const statusColors = {
  'not_started': 'bg-gray-100 text-gray-800',
  'ongoing': 'bg-blue-100 text-blue-800',
  'finished': 'bg-green-100 text-green-800',
  'canceled': 'bg-red-100 text-red-800'
};

const statusLabels = {
  'not_started': 'Not Started',
  'ongoing': 'Ongoing',
  'finished': 'Finished',
  'canceled': 'Canceled'
};

const categoryIcons: { [key: string]: JSX.Element } = {
  'Web Development': <FaHtml5 className="text-orange-500 text-4xl" />,
  'Frontend': <FaReact className="text-blue-500 text-4xl" />,
  'JavaScript': <FaJs className="text-yellow-500 text-4xl" />,
  'Python': <FaPython className="text-green-500 text-4xl" />,
  'UI/UX': <FaCss3Alt className="text-purple-500 text-4xl" />,
  'React': <FaReact className="text-blue-500 text-4xl" />,
  'Bootstrap': <FaBootstrap className="text-purple-700 text-4xl" />
};

const CourseCard: React.FC<CourseCardProps> = ({ course, onViewCourse, onEnrollSuccess }) => {
  const router = useRouter();

  const handleViewCourse = () => {
    const token = authService.getToken();
    if (!token) {
      router.push("/student/login");
      return;
    }

    if (onViewCourse) {
      onViewCourse(course._id);
    } else {
      router.push(`/student/courses/${course._id}`);
    }
  };

  const handleEnroll = async () => {
    try {
      const currentUser = await authService.getUser();
      if (!currentUser) {
        toast.error("Please login to enroll in this course");
        return;
      }

      if (currentUser.role !== "student") {
        toast.error("Only students can enroll in courses");
        return;
      }

      await courseService.enrollInCourse(course._id, currentUser._id);
      toast.success("Enrolled successfully!");
      onEnrollSuccess?.();
    } catch (error: any) {
      console.error("Enrollment error:", error);
      toast.error(error.response?.data?.message || "Failed to enroll in course");
    }
  };

  const formatDate = (date: Date | undefined | null): string => {
    if (!date) {
      return '';
    }

    if (!(date instanceof Date) || isNaN(date.getTime())) {
      console.error("Invalid Date object provided:", date);
      return '';
    }

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = () => {
    switch (course.status) {
      case 'not_started':
        return 'bg-gray-200';
      case 'ongoing':
        return 'bg-orange-500';
      case 'finished':
        return 'bg-green-500';
      case 'canceled':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getProgressWidth = () => {
    switch (course.status) {
      case 'not_started':
        return 'w-0';
      case 'ongoing':
        return 'w-1/2';
      case 'finished':
        return 'w-full';
      case 'canceled':
        return 'w-full';
      default:
        return 'w-0';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Progress Bar */}
      <div className="h-1 w-full bg-gray-100">
        <div className={`h-full ${getProgressWidth()} ${getProgressColor()} transition-all duration-500`} />
      </div>

      {/* Course Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            {categoryIcons[course.category as string] || <FaHtml5 className="text-orange-500 text-4xl" />}
            <h3 className="font-bold text-gray-800 text-lg line-clamp-1">{course.name}</h3>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[course.status as keyof typeof statusColors]}`}>
            {statusLabels[course.status as keyof typeof statusLabels]}
          </span>
          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${levelColors[course.level as keyof typeof levelColors]}`}>
            {course.level}
          </span>
        </div>
      </div>

      {/* Course Content */}
      <div className="p-4">
        {course.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {course.description}
          </p>
        )}

        {course.tutor && (
          <div className="flex items-center space-x-2 mb-3">
            <div className="relative w-8 h-8">
              <Image
                src={course.tutor.avatar || "/default-avatar.jpg"}
                alt={course.tutor.fullName}
                fill
                className="rounded-full object-cover"
                sizes="32px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/default-avatar.jpg";
                }}
              />
            </div>
            <span className="text-sm text-gray-600">
              {course.tutor.fullName}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>{course.students.length} students</span>
          </div>
          {course.startDate && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{formatDate(course.startDate)}</span>
            </div>
          )}
        </div>

        <button
          onClick={handleViewCourse}
          className="w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>View Course</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseCard;