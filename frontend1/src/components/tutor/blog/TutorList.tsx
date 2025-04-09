import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { userService } from "../../../services/userService";
import { authService } from "../../../services/authService";

export interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  avatar?: string;
  specialization?: string;
  bio?: string;
  experience?: string;
  education?: string;
  rating?: number;
  totalStudents?: number;
  totalCourses?: number;
}

interface TutorListProps {
  onNewPost: () => void;
  onTutorClick: (tutorId: string) => void;
}

const TutorList = ({ onNewPost, onTutorClick }: TutorListProps) => {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTutor, setSelectedTutor] = useState<Tutor | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   const fetchTutors = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       if (!token) {
  //         router.push('/tutor/login');
  //         return;
  //       }

  //       const response = await axios.get('http://localhost:5000/api/v1/users/get-tutors', {
  //         headers: { Authorization: `Bearer ${token}` }
  //       });
  //       setTutors(response.data.data);
  //     } catch (err) {
  //       console.error("Error fetching tutors:", err);
  //       setError(err instanceof Error ? err.message : "Failed to fetch tutors");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchTutors();
  // }, [router]);
  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const token = authService.getToken();;
        if (!token) {
          router.push('/tutor/login');
          return;
        }

        const fetchedTutors = await userService.getTutors();
        setTutors(fetchedTutors);
      } catch (err) {
        console.error("Error fetching tutors:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch tutors");
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, [router]);

  // const handleTutorClick = async (tutorId: string) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) return;

  //     const response = await axios.get(`http://localhost:5000/api/v1/users/profile/${tutorId}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     setSelectedTutor(response.data.data);
  //     onTutorClick(tutorId);
  //   } catch (err) {
  //     console.error("Error fetching tutor profile:", err);
  //   }
  // };
  const handleTutorClick = async (tutorId: string) => {
    try {
      const token = authService.getToken();;
      if (!token) return;
  
      // Use the userService to fetch tutor profile
      const tutorProfile = await userService.getProfile(tutorId);
  
      // Set the selected tutor data
      setSelectedTutor(tutorProfile);
  
      // Call the onTutorClick handler with the tutorId
      onTutorClick(tutorId);
    } catch (err) {
      console.error("Error fetching tutor profile:", err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md p-4 rounded-md w-60">
        <h3 className="font-semibold text-gray-700 mb-3">Tutors Active</h3>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md p-4 rounded-md w-60">
        <h3 className="font-semibold text-gray-700 mb-3">Tutors Active</h3>
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md p-4 rounded-md w-60">
      {/* Tiêu đề */}
      <h3 className="font-semibold text-gray-700 mb-3">Tutors Active</h3>

      {/* Danh sách tutor */}
      <ul className="space-y-2">
        {tutors.map((tutor) => (
          <li 
            key={tutor._id} 
            className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 transition cursor-pointer"
            onClick={() => handleTutorClick(tutor._id)}
          >
            <Image
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.fullName)}&background=random`}
              alt={tutor.fullName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <span className="text-gray-700 block font-medium">{tutor.fullName}</span>
              {tutor.specialization && (
                <span className="text-sm text-gray-500">{tutor.specialization}</span>
              )}
              {tutor.rating && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400">★</span>
                  <span className="text-sm text-gray-600">{tutor.rating.toFixed(1)}</span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      {/* Nút thêm bài viết */}
      <button 
        onClick={onNewPost}
        className="mt-4 w-full px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition flex items-center justify-center gap-2"
      >
        <span>+</span>
        <span>New Post</span>
      </button>

      {/* Tutor Profile Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Tutor Profile</h3>
              <button 
                onClick={() => setSelectedTutor(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={selectedTutor.avatar || "/images/default-avatar.png"}
                alt={selectedTutor.fullName}
                width={80}
                height={80}
                className="rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-800">{selectedTutor.fullName}</h4>
                <p className="text-gray-600">{selectedTutor.specialization}</p>
                {selectedTutor.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-600">{selectedTutor.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {selectedTutor.bio && (
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">About</h5>
                  <p className="text-gray-600">{selectedTutor.bio}</p>
                </div>
              )}

              {selectedTutor.experience && (
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Experience</h5>
                  <p className="text-gray-600">{selectedTutor.experience}</p>
                </div>
              )}

              {selectedTutor.education && (
                <div>
                  <h5 className="font-semibold text-gray-700 mb-2">Education</h5>
                  <p className="text-gray-600">{selectedTutor.education}</p>
                </div>
              )}

              <div className="flex gap-4 text-sm text-gray-600">
                {selectedTutor.totalStudents && (
                  <span>{selectedTutor.totalStudents} Students</span>
                )}
                {selectedTutor.totalCourses && (
                  <span>{selectedTutor.totalCourses} Courses</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorList;
