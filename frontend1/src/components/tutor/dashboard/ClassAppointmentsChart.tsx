"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { day: 'Mon', Class1: 40, Class2: 60, Class3: 20 },
  { day: 'Tue', Class1: 30, Class2: 80, Class3: 50 },
  { day: 'Wed', Class1: 70, Class2: 50, Class3: 40 },
  { day: 'Thu', Class1: 60, Class2: 30, Class3: 80 },
  { day: 'Fri', Class1: 50, Class2: 70, Class3: 90 },
  { day: 'Sat', Class1: 80, Class2: 90, Class3: 60 },
  { day: 'Sun', Class1: 20, Class2: 40, Class3: 30 },
];

const ClassAppointmentsChart = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-2">Class Appointments</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Class1" stroke="#8884d8" strokeWidth={2} />
          <Line type="monotone" dataKey="Class2" stroke="#ff6b6b" strokeWidth={2} />
          <Line type="monotone" dataKey="Class3" stroke="#4bc0c0" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ClassAppointmentsChart;
