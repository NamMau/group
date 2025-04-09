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

  if (loading) return <div>Đang tải chi tiết khóa học...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!course) return <div>Không tìm thấy thông tin khóa học.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{course.name}</h1>
      <p className="text-gray-700 my-2">{course.description}</p>
      <p className="text-sm text-gray-500">Bắt đầu: {course.startDate ? format(course.startDate, 'dd/MM/yyyy') : 'N/A'}</p>
      <p className="text-sm text-gray-500">Kết thúc: {course.endDate ? format(course.endDate, 'dd/MM/yyyy') : 'N/A'}</p>
      <p className="text-sm mt-2 text-gray-600">Trạng thái: <span className="capitalize">{course.status}</span></p>
      <p className="mt-2 text-sm">Giảng viên: {course.tutor?.fullName}</p>
    </div>
  );
};

export default CourseDetailPage;
