"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBook, FaUserGraduate, FaFileAlt } from "react-icons/fa";

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

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/student/document/${course._id}`);
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
        <h3 className="text-lg font-semibold text-gray-800 hover:text-orange-500 transition-colors duration-200">
          {course.name}
        </h3>
        
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
      </div>
    </div>
  );
};

export default CourseCard;
