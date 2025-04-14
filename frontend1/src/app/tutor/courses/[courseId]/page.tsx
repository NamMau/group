'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { courseService, Course } from '../../../../services/courseService';
import { format } from 'date-fns';

const CourseDetailPage = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await courseService.getCourse(courseId as string);
        setCourse(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!course) return <div>Course's information not found!</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">{course.name}</h1>

      <table className="min-w-full border border-gray-200 shadow rounded-lg overflow-hidden">
        <tbody>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-50 w-1/3">Description</td>
            <td className="px-4 py-3">{course.description || 'No description available'}</td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-50">Start Date</td>
            <td className="px-4 py-3">
              {course.startDate ? format(course.startDate, 'dd/MM/yyyy') : 'N/A'}
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-50">End Date</td>
            <td className="px-4 py-3">
              {course.endDate ? format(course.endDate, 'dd/MM/yyyy') : 'N/A'}
            </td>
          </tr>
          <tr className="border-b">
            <td className="px-4 py-3 font-medium bg-gray-50">Status</td>
            <td className="px-4 py-3 capitalize">{course.status}</td>
          </tr>
          <tr>
            <td className="px-4 py-3 font-medium bg-gray-50">Tutor</td>
            <td className="px-4 py-3">{course.tutor?.fullName || 'Unassigned'}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CourseDetailPage;
