import Image from "next/image";
import { FiStar, FiUsers, FiPlus, FiBook, FiPhone, FiRefreshCw } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

interface Tutor {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  students: string[];
  department: string;
  phoneNumber: string;
  preferences?: {
    [key: string]: any;
  };
  loginHistory: any[];
  createdAt: string;
  updatedAt: string;
}

interface TutorListProps {
  onNewPost?: () => void;
  onTutorClick?: (tutorId: string) => void;
}

const TutorList: React.FC<TutorListProps> = ({ 
  onNewPost,
  onTutorClick 
}) => {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view tutors');
        return;
      }

      const response = await axios.get(
        'http://localhost:5000/api/v1/users/get-tutors',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setTutors(response.data.data);
    } catch (err: any) {
      console.error('Error fetching tutors:', err);
      setError(err.response?.data?.message || 'Failed to fetch tutors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-72 p-4">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-72 p-4">
        <div className="text-center text-red-500">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchTutors}
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden w-72">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Active Tutors</h3>
          <p className="text-sm text-gray-500 mt-1">
            {tutors.filter(t => t.isActive).length} tutors online
          </p>
        </div>
        <button
          onClick={fetchTutors}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          title="Refresh"
        >
          <FiRefreshCw className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Tutor List */}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {tutors.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No tutors found
          </div>
        ) : (
          tutors.map((tutor) => (
            <div
              key={tutor._id}
              onClick={() => onTutorClick?.(tutor._id)}
              className="flex items-center gap-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors border-b last:border-b-0"
            >
              <div className="relative">
                <Image
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.fullName)}&background=random`}
                  alt={tutor.fullName}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                {tutor.isActive && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 truncate">
                    {tutor.fullName}
                  </h4>
                  <div className="flex items-center text-sm text-gray-500">
                    <FiUsers className="w-4 h-4 mr-1" />
                    <span>{tutor.students.length} students</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <FiBook className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 truncate">
                    {tutor.department}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {tutor.phoneNumber}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    Joined {formatDate(tutor.createdAt)}
                  </span>
                  {tutor.loginHistory.length > 0 && (
                    <span className="text-xs text-gray-400">
                      Last login: {formatDate(tutor.loginHistory[tutor.loginHistory.length - 1].timestamp)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Post Button */}
      <div className="p-4 border-t">
        <button
          onClick={onNewPost}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          <span>Create New Post</span>
        </button>
      </div>
    </div>
  );
};

export default TutorList;
