"use client";
;import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon 20', messages: 100 },
  { day: 'Tue 21', messages: 120 },
  { day: 'Wed 22', messages: 90 },
  { day: 'Thu 23', messages: 130 },
  { day: 'Fri 24', messages: 110 },
  { day: 'Sat 25', messages: 140 },
  { day: 'Sun 26', messages: 100 },
];

const MessagesChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Number of Messages</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="messages" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessagesChart;
