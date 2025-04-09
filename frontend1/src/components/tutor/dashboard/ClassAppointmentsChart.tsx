// "use client";
// import { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// import axios from 'axios';
// import { authService } from '../../../services/authService';

// interface AppointmentData {
//   day: string;
//   [key: string]: number | string;
// }

// const COLORS = ['#8884d8', '#ff6b6b', '#4bc0c0'];

// const ClassAppointmentsChart = () => {
//   const [data, setData] = useState<AppointmentData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [classes, setClasses] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = authService.getToken();
//         if (!token) {
//           setData([]);
//           setLoading(false);
//           return;
//         }

//         const response = await axios.get('http://localhost:5000/api/v1/analytics/class-appointments', {
//           headers: { Authorization: `Bearer ${token}` }
//         });

//         const { appointments, classNames } = response.data.data;
//         setData(appointments || []);
//         setClasses(classNames || []);
//         setError(null);
//       } catch (err) {
//         console.error("Error fetching class appointments:", err);
//         setError(err instanceof Error ? err.message : "Failed to fetch appointments");
//         setData([]);
//         setClasses([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   if (loading) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-2">Class Appointments</h2>
//         <div className="h-[300px] flex items-center justify-center">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white p-4 rounded-lg shadow-md">
//         <h2 className="text-lg font-semibold mb-2">Class Appointments</h2>
//         <div className="h-[300px] flex items-center justify-center text-red-500">
//           {error}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md">
//       <h2 className="text-lg font-semibold mb-2">Class Appointments</h2>
//       {data.length > 0 && classes.length > 0 ? (
//         <ResponsiveContainer width="100%" height={300}>
//           <LineChart data={data}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="day" />
//             <YAxis />
//             <Tooltip />
//             <Legend />
//             {classes.map((className, index) => (
//               <Line
//                 key={className}
//                 type="monotone"
//                 dataKey={className}
//                 stroke={COLORS[index % COLORS.length]}
//                 strokeWidth={2}
//                 dot={{ r: 4 }}
//                 activeDot={{ r: 6 }}
//               />
//             ))}
//           </LineChart>
//         </ResponsiveContainer>
//       ) : (
//         <div className="h-[300px] flex items-center justify-center text-gray-500">
//           No appointment data available
//         </div>
//       )}
//     </div>
//   );
// };

// export default ClassAppointmentsChart;
