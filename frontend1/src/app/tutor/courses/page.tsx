 'use client';

import React from 'react';
import CourseList from '@/components/tutor/courses/CourseList';
import Navbar from '@/components/tutor/dashboard/Navbar';
import Sidebar from '@/components/tutor/dashboard/Sidebar';

const CoursesPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-6">
        <Navbar />
        <div className="mt-14">
          <h1 className="text-2xl font-bold mb-4">My Courses</h1>
          <CourseList />
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
