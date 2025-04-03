export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard for managing the eTutoring system',
};

export default function DashboardLayout({
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