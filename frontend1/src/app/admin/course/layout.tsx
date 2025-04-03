export const metadata = {
  title: 'Admin Course',
  description: 'Manage courses in the eTutoring system',
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
} 