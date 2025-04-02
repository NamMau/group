"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaBook, FaUserGraduate } from "react-icons/fa";

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
    router.push(`/student/courses/${course._id}`);
  };

  // const getCategoryIcon = (category: string) => {
  //   switch (category.toLowerCase()) {
  //     case 'web development':
  //       return '/html5.png';
  //     case 'frontend':
  //       return '/css3.png';
  //     case 'javascript':
  //       return '/javascript.png';
  //     case 'python':
  //       return '/python.png';
  //     case 'ui/ux':
  //       return '/bootstrap.png';
  //     case 'react':
  //       return '/react.png';
  //     default:
  //       return '/html5.png';
  //   }
  // };

  return (
    <div 
      className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={handleClick}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-12 h-12">
            {/* <Image
              fill
              className="object-contain"
            /> */}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{course.name}</h2>
            <p className="text-sm text-gray-500">{course.category}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          course.status === 'ongoing' ? 'bg-green-100 text-green-800' :
          course.status === 'finished' ? 'bg-blue-100 text-blue-800' :
          course.status === 'not_started' ? 'bg-gray-100 text-gray-800' :
          'bg-red-100 text-red-800'
        }`}>
          {course.status.replace('_', ' ')}
        </span>
      </div>

      {course.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
      )}

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-2">
          <FaUserGraduate className="text-orange-500" />
          <span>{course.students.length} students</span>
        </div>
        <div className="flex items-center space-x-2">
          <FaBook className="text-orange-500" />
          <span>{course.level}</span>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
