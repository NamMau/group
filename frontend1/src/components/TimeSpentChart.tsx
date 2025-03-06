import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 3 },
];

const TimeSpentChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="hours" fill="#FFA500" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default TimeSpentChart;
