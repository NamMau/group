"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { studyTimeService, StudyTimeData } from "../../../services/studyTimeService";

const COLORS = ["#FFB067", "#FFA25B", "#FF934F", "#FF7E42", "#FF6936", "#FF552A", "#FF411E"];

const TimeSpentChart = () => {
  const [data, setData] = useState<StudyTimeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Get student ID from localStorage or your auth context
        const studentId = localStorage.getItem('userId');
        if (!studentId) {
          throw new Error('Student ID not found');
        }
        const studyTimeData = await studyTimeService.getStudyTime(studentId);
        setData(studyTimeData);
      } catch (err) {
        setError("Failed to load study time data");
        console.error("Error fetching study time data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-[300px] text-red-500">
        {error}
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={30}>
        <XAxis 
          dataKey="day" 
          tick={{ fill: "#4B5563" }}
          tickFormatter={(value) => value.substring(0, 3)} // Show only first 3 letters of day
        />
        <YAxis 
          tick={{ fill: "#4B5563" }}
          tickFormatter={(value) => `${value}h`} // Add 'h' suffix to hours
        />
        <Tooltip 
          cursor={{ fill: "#F3F4F6" }}
          formatter={(value: number) => [`${value} hours`, 'Study Time']}
        />
        <Bar dataKey="hours" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeSpentChart;
