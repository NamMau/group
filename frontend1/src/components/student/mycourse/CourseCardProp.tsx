"use client";
import React from "react";
import { FaUserGraduate, FaClock, FaBookOpen, FaUserTie } from "react-icons/fa";
import { Course } from "@/services/courseService"; 

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
    if (!course.createdAt) return false;
  
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return course.createdAt > oneWeekAgo;
  };  

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
