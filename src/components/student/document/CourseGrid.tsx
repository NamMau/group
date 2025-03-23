"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const documents = [
  { id: "1", courseCode: "FA22_SSLG102", teacher: "Tran Van Tuong", image: "/book-cover.jpg" },
  { id: "2", courseCode: "FA22_MATH101", teacher: "Nguyen Van A", image: "/math-cover.jpg" },
];

const CourseGrid = () => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-3 gap-6 p-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-white border rounded-lg p-4 shadow-md cursor-pointer hover:shadow-lg transition duration-300 hover:scale-105"
          onClick={() => router.push(`/student/document/submit`)} // Chỉ điều hướng đến /document, không có ID
        >
          {/* Ảnh bìa khóa học */}
          <div className="relative w-full h-40 bg-gray-200 rounded-md overflow-hidden">
            {doc.image ? (
              <Image
                src={doc.image}
                alt={doc.courseCode}
                fill
                className="object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">
                No Image
              </div>
            )}
          </div>

          {/* Thông tin khóa học */}
          <div className="mt-3">
            <h3 className="text-lg font-semibold text-gray-700">{doc.courseCode}</h3>
            <p className="text-sm text-gray-500">Teacher: {doc.teacher}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseGrid;
