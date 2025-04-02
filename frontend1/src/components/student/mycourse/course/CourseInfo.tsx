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

interface CourseInfoProps {
  course: Course;
}

const CourseInfo = ({ course }: CourseInfoProps) => {
  const infoItems = [
    { icon: "📌", text: `${course.level} Level` },
    { icon: "⏳", text: `Start Date: ${new Date(course.startDate || "").toLocaleDateString()}` },
    { icon: "📚", text: `${course.students.length} Students Enrolled` },
    { icon: "🌍", text: `Status: ${course.status.replace('_', ' ')}` },
  ];

  return (
    <ul className="mt-6 space-y-3">
      {infoItems.map((item, index) => (
        <li key={index} className="flex items-center gap-3 text-gray-700 text-lg">
          <span className="text-[#6D4C41] text-xl">{item.icon}</span>
          <span>{item.text}</span>
        </li>
      ))}
    </ul>
  );
};

export default CourseInfo;
  