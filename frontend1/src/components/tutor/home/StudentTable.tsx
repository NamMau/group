const students = [
    { id: 1, name: "Kristin Watson", studentId: "9784", email: "michele.rivers@example.com" },
    { id: 2, name: "Kristin Watson", studentId: "9784", email: "michele.rivers@example.com" },
  ];
  
  const StudentTable = () => {
    return (
      <div className="bg-gray-50 p-4 rounded shadow">
        <h2 className="text-lg font-semibold text-brown-700">Name Course</h2>
        <table className="w-full mt-4 border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">#</th>
              <th className="p-2">Student Name</th>
              <th className="p-2">Student ID</th>
              <th className="p-2">Email Address</th>
              <th className="p-2">Operation</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{student.name}</td>
                <td className="p-2">{student.studentId}</td>
                <td className="p-2">{student.email}</td>
                <td className="p-2 flex space-x-2">
                  <button className="bg-blue-500 text-white p-1 rounded">💬</button>
                  <button className="bg-yellow-500 text-white p-1 rounded">⏸️</button>
                  <button className="bg-green-500 text-white p-1 rounded">📹</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  export default StudentTable;
  