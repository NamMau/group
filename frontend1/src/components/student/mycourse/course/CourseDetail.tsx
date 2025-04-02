"use client";
import React from "react";
import { FaUserGraduate, FaCalendarAlt, FaClock, FaBookOpen, FaUserTie } from "react-icons/fa";

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

interface CourseDetailProps {
  course: Course;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
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

  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-[#6D4C41]">{course.name}</h1>
            <p className="text-[#D4A373] text-lg font-semibold mt-1">{course.category}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(course.status)}`}>
            {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* Description */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Description</h2>
          <p className="text-gray-700 leading-relaxed">
            {course.description || "No description available"}
          </p>
        </div>

        {/* Course Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Tutor */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-full">
              <FaUserTie className="text-orange-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tutor</p>
              <p className="font-medium text-gray-800">
                {course.tutor?.fullName || "Not assigned"}
              </p>
            </div>
          </div>

          {/* Level */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <FaUserGraduate className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level</p>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getLevelColor(course.level)}`}>
                {course.level}
              </span>
            </div>
          </div>

          {/* Duration */}
          {course.duration && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-full">
                <FaClock className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium text-gray-800">{course.duration} hours</p>
              </div>
            </div>
          )}

          {/* Total Lessons */}
          {course.totalLessons && (
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-full">
                <FaBookOpen className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Lessons</p>
                <p className="font-medium text-gray-800">{course.totalLessons} lessons</p>
              </div>
            </div>
          )}

          {/* Start Date */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Start Date</p>
              <p className="font-medium text-gray-800">{formatDate(course.startDate)}</p>
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 rounded-full">
              <FaCalendarAlt className="text-yellow-600 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">End Date</p>
              <p className="font-medium text-gray-800">{formatDate(course.endDate)}</p>
            </div>
          </div>
        </div>

        {/* Price */}
        {course.price && (
          <div className="mt-6 p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-orange-600">Price</p>
            <p className="text-2xl font-bold text-orange-700">${course.price}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
  