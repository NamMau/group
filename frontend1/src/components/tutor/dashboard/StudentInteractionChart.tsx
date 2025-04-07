"use client";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Interacted', value: 150 },
  { name: 'No interact', value: 56 },
];

const COLORS = ['#ff6b6b', '#8884d8'];

const StudentInteractionChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className=" text-lg font-semibold mb-2">Number of Students Interacting</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StudentInteractionChart;
