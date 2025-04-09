import { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../../../services/authService';

interface DocumentReview {
  class: string;
  reviews: number;
  maxReviews: number;
}

const DocumentReviews = () => {
  const [reviews, setReviews] = useState<DocumentReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setReviews([]);
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:5000/api/v1/analytics/document-reviews', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setReviews(response.data.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching document reviews:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reviews");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Document Reviews</h2>
        <div className="h-[200px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Document Reviews</h2>
        <div className="h-[200px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Document Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-2">
          {reviews.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{item.class}</p>
                <p className="text-xs text-gray-500">{item.reviews}/{item.maxReviews}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-orange-500 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${(item.reviews / item.maxReviews) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[200px] flex items-center justify-center text-gray-500">
          No reviews available
        </div>
      )}
    </div>
  );
};

export default DocumentReviews;
  