"use client";
import Image from "next/image";
import { JSX } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/services/courseService"; 
import {
  FaBook,
  FaUserGraduate,
  FaFileAlt,
  FaHtml5,
  FaReact,
  FaJs,
  FaPython,
  FaCss3Alt,
  FaBootstrap,
} from "react-icons/fa";

const categoryIcons: { [key: string]: JSX.Element } = {
  'Web Development': <FaHtml5 className="text-orange-500 text-2xl mr-2" />,
  'Frontend': <FaReact className="text-blue-500 text-2xl mr-2" />,
  'JavaScript': <FaJs className="text-yellow-500 text-2xl mr-2" />,
  'Python': <FaPython className="text-green-500 text-2xl mr-2" />,
  'UI/UX': <FaCss3Alt className="text-purple-500 text-2xl mr-2" />,
  'React': <FaReact className="text-blue-500 text-2xl mr-2" />,
  'Bootstrap': <FaBootstrap className="text-purple-700 text-2xl mr-2" />,
};

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  const handleClick = () => {
    //router.push(`/student/document/upload`);
    router.push(`/student/document/upload/${course._id}`);
  };

  return (
    <div 
      className="bg-white border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative w-full h-40 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
        {course.tutor?.avatar ? (
          <Image 
            src={course.tutor.avatar} 
            alt={course.name} 
            layout="fill" 
            objectFit="cover" 
            className="rounded-md hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <FaBook className="text-4xl mb-2" />
            <span>No Image</span>
          </div>
        )}
      </div>
      
      <div className="mt-4">
         {/* Tiêu đề với icon danh mục */}
         <div className="flex items-center">
          {categoryIcons[course.category] || (
            <FaBook className="text-gray-400 text-2xl mr-2" />
          )}
          <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors duration-200">
            {course.name}
          </h3>
        </div>
    
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <FaUserGraduate className="mr-2" />
          <span>{course.tutor?.fullName || 'No tutor assigned'}</span>
        </div>

        {course.description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {course.description}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <FaFileAlt className="mr-1" />
            <span>{course.students.length} students</span>
          </div>
          <div className="flex items-center">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              course.status === 'ongoing' ? 'bg-green-100 text-green-800' :
              course.status === 'finished' ? 'bg-blue-100 text-blue-800' :
              course.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
              'bg-red-100 text-red-800'
            }`}>
              {course.status.replace('_', ' ')}
            </span>
          </div>
        </div>
        {/* Button Go on */}
        <div className="mt-4">
          <button
            onClick={handleClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Go on
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
