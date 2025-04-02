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

interface EnrollButtonProps {
  course: Course;
}

const EnrollButton = ({ course }: EnrollButtonProps) => {
  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`http://localhost:5000/api/v1/courses/${course._id}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Enrollment failed');
      }

      // Refresh the page to show updated status
      window.location.reload();
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course. Please try again.');
    }
  };

  const isEnrolled = course.students.includes(localStorage.getItem("userId") || "");

  return (
    <button 
      onClick={handleEnroll}
      disabled={isEnrolled || course.status !== 'not_started'}
      className={`${
        isEnrolled 
          ? 'bg-green-500 cursor-not-allowed' 
          : course.status !== 'not_started'
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-[#E6B17E] hover:bg-[#D4A373]'
      } text-white font-bold py-2 px-6 rounded-lg shadow-md mt-6 w-full transition-colors`}
    >
      {isEnrolled ? 'Already Enrolled' : course.status !== 'not_started' ? 'Enrollment Closed' : 'Enroll in Course'}
    </button>
  );
};

export default EnrollButton;
  