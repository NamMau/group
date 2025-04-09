"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { studyTimeService, StudyTimeData } from "../../../services/studyTimeService";
import { authService } from '../../../services/authService';

interface TimeSpentChartProps {
  userId: string;
}

const COLORS = ["#FFB067", "#FFA25B", "#FF934F", "#FF7E42", "#FF6936", "#FF552A", "#FF411E"];

const TimeSpentChart = ({ userId }: TimeSpentChartProps) => {
  const [data, setData] = useState<StudyTimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setData([]);
          setLoading(false);
          return;
        }

        setError(null);
        const studyTimeData = await studyTimeService.getStudyTime(userId);
        setData(studyTimeData);
      } catch (err) {
        console.error("Error fetching study time data:", err);
        setError(err instanceof Error ? err.message : "Failed to load study time data");
        // Don't clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Set up polling every 5 minutes
    const interval = setInterval(fetchData, 300000);
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Study Time</h2>
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Study Time</h2>
        <div className="flex justify-center items-center h-[300px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4">Study Time</h2>
        <div className="flex justify-center items-center h-[300px] text-gray-500">
          No study time data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Study Time</h2>
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
    </div>
  );
};

export default TimeSpentChart;
