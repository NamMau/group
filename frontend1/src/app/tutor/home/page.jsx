
const Dashboard = () => {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-5">
          <Navbar />
          <h2 className="text-xl font-bold my-4">My Course</h2>
          <div className="grid grid-cols-3 gap-4">
            <CourseCard title="HTML 5" />
            <CourseCard title="HTML 5" />
            <CourseCard title="HTML 5" />
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;
  