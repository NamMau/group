import Image from "next/image";

interface CourseCardProps {
  title: string;
}

const CourseCard: React.FC<CourseCardProps> = ({ title }) => {
  return (
    <div className="bg-[#F4F1EC] border border-[#D6CCC2] p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center">
      <Image
        src="/html5.png"
        alt="HTML5"
        width={64}
        height={64}
        className="mb-3"
      />
      <h2 className="text-base font-semibold text-[#5A3E2B]">{title}</h2>
      <button className="text-[#A67B5B] mt-2 font-medium hover:underline">View &gt;</button>
    </div>
  );
};

export default CourseCard;
