import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const data = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 4 },
  { day: "Thu", hours: 2 },
  { day: "Fri", hours: 5 },
  { day: "Sat", hours: 6 },
  { day: "Sun", hours: 3 },
];

const COLORS = ["#FFB067", "#FFA25B", "#FF934F", "#FF7E42", "#FF6936", "#FF552A", "#FF411E"];

const TimeSpentChart = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} barSize={30}>
        <XAxis dataKey="day" tick={{ fill: "#4B5563" }} />
        <YAxis tick={{ fill: "#4B5563" }} />
        <Tooltip cursor={{ fill: "#F3F4F6" }} />
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
