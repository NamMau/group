'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { userService } from '@/services/userService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface Student {
  _id: string;
  fullName: string;
}

export const StatisticsCharts = () => {
  const [messageStats, setMessageStats] = useState<any>(null);
  const [exceptionStats, setExceptionStats] = useState<any>(null);
  const [studentsWithoutTutor, setStudentsWithoutTutor] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [msgStats, excStats] = await Promise.all([
          userService.getMessageStatistics(),
          userService.getExceptionReports()
        ]);

        // Transform student data
        const transformedStudents = excStats.studentsWithoutTutor.map((rawStudent: any) => {
          console.log('Raw student data:', rawStudent);
          // Kiểm tra xem dữ liệu student có nằm trong trường student không
          const student = rawStudent.student || rawStudent;
          const transformed = {
            _id: student._id || student.studentId || String(Math.random()),
            fullName: student.fullName || student.name || 'Unknown Student'
          };
          console.log('Transformed student:', transformed);
          return transformed;
        });

        // Transform message stats for pie chart
        const messageData = [
          {
            name: 'Last 7 Days',
            value: msgStats.last7Days.reduce((sum, day) => sum + day.count, 0)
          },
          ...msgStats.averagePerTutor.map(tutor => ({
            name: tutor.tutorName,
            value: Math.round(tutor.average)
          }))
        ];

        // Transform exception stats for pie chart
        const exceptionData = [
          {
            name: 'Without Tutor',
            value: excStats.studentsWithoutTutor.length,
            students: transformedStudents
          },
          {
            name: 'Inactive (7 Days)',
            value: excStats.inactiveStudents.sevenDays.length,
            students: excStats.inactiveStudents.sevenDays
          },
          {
            name: 'Inactive (28 Days)',
            value: excStats.inactiveStudents.twentyEightDays.length,
            students: excStats.inactiveStudents.twentyEightDays
          }
        ];

        console.log('Final transformed students:', transformedStudents);
        setMessageStats(messageData);
        setExceptionStats(exceptionData);
        setStudentsWithoutTutor(transformedStudents);
        setError(null);
      } catch (err) {
        console.error('Error fetching statistics:', err);
        setError('Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handlePieClick = (data: any) => {
    console.log('Clicked data:', data);
    if (data && data.payload && data.payload.name === 'Without Tutor') {
      console.log('Setting selected section to Without Tutor');
      setSelectedSection('Without Tutor');
    } else {
      setSelectedSection(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Message Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Message Statistics</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={messageStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value}`}
              >
                {messageStats.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Exception Reports */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Exception Reports</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={exceptionStats}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => `${entry.name}: ${entry.value}`}
                onClick={(data) => {
                  console.log('Pie click data:', data);
                  handlePieClick(data);
                }}
                className="cursor-pointer"
              >
                {exceptionStats?.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend 
                onClick={(entry) => {
                  console.log('Legend click entry:', entry);
                  if (entry.value === 'Without Tutor') {
                    setSelectedSection('Without Tutor');
                  } else {
                    setSelectedSection(null);
                  }
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Students Without Tutor List */}
        {selectedSection === 'Without Tutor' && (
          <div className="mt-4">
            <h4 className="font-semibold mb-2">Students Without Personal Tutor:</h4>
            <div className="max-h-40 overflow-y-auto">
              {studentsWithoutTutor.length > 0 ? (
                <ul className="list-disc pl-5">
                  {studentsWithoutTutor.map((student) => {
                    console.log('Rendering student:', student);
                    return (
                      <li key={student._id} className="text-sm py-1">
                        {student.fullName}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No students without tutors</p>
              )}
            </div>
          </div>
        )}

        {/* Debug section */}
        <div className="mt-4 text-xs text-gray-500">
          <p>Selected Section: {selectedSection}</p>
          <p>Students Count: {studentsWithoutTutor.length}</p>
        </div>
      </div>
    </div>
  );
}; 