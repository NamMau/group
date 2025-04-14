"use client";
import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";
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
        <div className="flex justify-center items-center h-[300px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-[300px] text-red-500">
          {error}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-center items-center h-[300px] text-gray-500">
          No study time data available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <ResponsiveContainer width="100%" height={450}>
        <BarChart 
          data={data} 
          barSize={35}
          margin={{ top: 20, right: 40, left: 40, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) => value.substring(0, 3)}
            dy={10}
            height={50}
          />
          <YAxis 
            tick={{ fill: "#4B5563", fontSize: 12 }}
            tickFormatter={(value) => `${value}h`}
            dx={-10}
            width={50}
          />
          <Tooltip 
            cursor={{ fill: "rgba(243, 244, 246, 0.8)" }}
            contentStyle={{ 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "8px 12px",
              fontSize: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Study Time']}
            wrapperStyle={{ zIndex: 1000 }}
          />
          <Bar 
            dataKey="hours" 
            radius={[8, 8, 0, 0]}
            animationDuration={1500}
            animationBegin={0}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimeSpentChart;
