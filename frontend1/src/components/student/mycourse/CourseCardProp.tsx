"use client";
import React from "react";
import { FaUserGraduate, FaClock, FaBookOpen, FaUserTie } from "react-icons/fa";

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
  price?: number;
  duration?: number; // in hours
  totalLessons?: number;
}

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'finished':
        return 'bg-gray-100 text-gray-800';
      case 'canceled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isNew = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(course.createdAt) > oneWeekAgo;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Course Image */}
      <div className="relative h-48 bg-gray-200">
        {course.tutor?.avatar && (
          <img 
            src={course.tutor.avatar} 
            alt={course.name}
            className="w-full h-full object-cover"
          />
        )}
        {isNew() && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
        <span className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.status)}`}>
          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
        </span>
      </div>

      {/* Course Content */}
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2">{course.name}</h3>
        
        <div className="flex items-center space-x-2 mb-3">
          <FaUserTie className="text-orange-500" />
          <span className="text-sm text-gray-600">{course.tutor?.fullName || "Not assigned"}</span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <FaUserGraduate className="text-blue-500" />
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
            {course.level}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          {course.duration && (
            <div className="flex items-center space-x-1">
              <FaClock className="text-purple-500" />
              <span className="text-sm text-gray-600">{course.duration}h</span>
            </div>
          )}
          {course.totalLessons && (
            <div className="flex items-center space-x-1">
              <FaBookOpen className="text-green-500" />
              <span className="text-sm text-gray-600">{course.totalLessons} lessons</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{course.category}</span>
          {course.price && (
            <span className="text-lg font-bold text-orange-600">${course.price}</span>
          )}
        </div>

        <button 
          onClick={onClick}
          className="mt-4 w-full px-4 py-2 bg-[#C1915F] text-white rounded-md hover:bg-[#A6784D] transition-colors duration-200"
        >
          View Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
