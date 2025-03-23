import Image from "next/image";

interface CourseCardProps {
  courseCode: string;
  teacher: string;
  image?: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ courseCode, teacher, image }) => {
  return (
    <div className="bg-gray-100 border rounded-lg p-4 shadow-md">
      <div className="relative w-full h-32 bg-gray-300 rounded-md flex items-center justify-center overflow-hidden">
        {image ? (
          <Image src={image} alt={courseCode} layout="fill" objectFit="cover" className="rounded-md" />
        ) : (
          "No Image"
        )}
      </div>
      <h3 className="mt-2 text-lg font-semibold text-gray-700">{courseCode}</h3>
      <p className="text-sm text-gray-500">Teacher: {teacher}</p>
    </div>
  );
};

export default CourseCard;
