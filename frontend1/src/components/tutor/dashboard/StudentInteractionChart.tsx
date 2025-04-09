"use client";
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { authService } from '../../../services/authService';

interface InteractionData {
  name: string;
  value: number;
}

const COLORS = ['#ff6b6b', '#8884d8'];

const StudentInteractionChart = () => {
  const [data, setData] = useState<InteractionData[]>([]);
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

        const response = await axios.get('http://localhost:5000/api/v1/analytics/student-interactions', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setData([
          { name: 'Interacted', value: response.data.data.interactedCount || 0 },
          { name: 'No interact', value: response.data.data.noInteractCount || 0 }
        ]);
        setError(null);
      } catch (err) {
        console.error("Error fetching student interaction data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Number of Students Interacting</h2>
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Number of Students Interacting</h2>
        <div className="h-[300px] flex items-center justify-center text-red-500">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Number of Students Interacting</h2>
      {data.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={80} 
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  );
};

export default StudentInteractionChart;
